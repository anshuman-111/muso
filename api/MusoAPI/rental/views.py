
from rest_framework.views import APIView
from .serializers import RentalCreateSerialzer, RentalTakeSerialzer, RentalAllInfoSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Rentals

from rest_framework.permissions import IsAuthenticated
from .vision.image_fetcher import run_matching
# Create your views here.
class CreateRentalView(APIView):
    ''' Create a new Rental '''
    permission_classes= [IsAuthenticated]
    def post(self, request):
        serializer = RentalCreateSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rental = serializer.save()
        rental_id = rental.rental_id
        return Response(status=status.HTTP_200_OK, data=rental_id)




class DeleteRentalView(APIView):
    ''' Delete Rental if it exists '''
    permission_classes= [IsAuthenticated]
    def post(self, request, rentalId):
        try:
            rental = Rentals.objects.get(pk=rentalId)
            if rental.is_rental_active:
                return Response(
                    data={"msg": "Rental is still active"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            rental.delete()
            return Response(
                data={"msg": "Rental deleted"},
                status=status.HTTP_200_OK,
            )
        except Rentals.DoesNotExist:
            return Response(
                data={"message": "Rental does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )



class ShowRentalsList(APIView):
    ''' Get All Rentals that have not been rented and have not expired '''
    def get(self, request):
        try:
            rental = Rentals.objects.filter(renter__isnull=True)
        except Rentals.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RentalCreateSerialzer(instance=rental, many=True)
        return Response(serializer.data)


class GetRentalView(APIView):
    ''' Get Rental based on RentalID '''
    def get(self, request, rentalId):
        try:
            rental = Rentals.objects.get(pk=rentalId)
        except Rentals.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental)
        return Response(serializer.data)


class GetPostedRentalView(APIView):
    ''' Get All Rental POSTED by a USER '''
    permission_classes= [IsAuthenticated]
    def get(self, request, userId):
        try:
            rental = Rentals.objects.filter(owner_id=userId)
        except Rentals.DoesNotExist:
            return Response({"msg": "Nothing here yet!"},status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental, many=True)
        return Response(serializer.data)
    
class GetTakenRentalView(APIView):
    ''' Get All Rental TAKEN by a USER '''
    permission_classes= [IsAuthenticated]
    def get(self, request, userId):
        try:
            rental = Rentals.objects.filter(renter=userId)
        except Rentals.DoesNotExist:
            return Response({"msg": "Nothing here yet!"},status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental, many=True)
        return Response(serializer.data)

class GetGivenRentalView(APIView):
    ''' Get All Rental GIVEN OUT by a USER '''
    permission_classes= [IsAuthenticated]
    def get(self, request, userId):
        try:
            rental = Rentals.objects.filter(owner=userId, renter__isnull=False)
        except Rentals.DoesNotExist:
            return Response({"msg": "Nothing here yet!"},status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental, many=True)
        return Response(serializer.data)


class TakeRental(APIView):
    ''' Mark Rental as active '''
    permission_classes= [IsAuthenticated]
    def post(self, request, rentalId):
        try:
            rental = Rentals.objects.get(pk=rentalId)
            
            serializer = RentalTakeSerialzer(instance=rental, data=request.data)
            rental.save()
            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Rental taken successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"msg": "Cannot get rental now. Try again later."}, status=status.HTTP_404_NOT_FOUND)
        except Rentals.DoesNotExist:
             return Response({"msg": "Cannot get rental now. Try again later."},status=status.HTTP_404_NOT_FOUND)
         
         
         
         
class ImageURLUpload(APIView):
    ''' Upload the Display image S3 URL for the rental '''
    permission_classes= [IsAuthenticated]
    def post(self, request, rentalId):
        try:
            rental = Rentals.objects.get(pk=rentalId)
            rental.rental_image_url = request.data["img_url"]
            rental.save()
            return Response({"msg": "Display picture uploaded"}, status=status.HTTP_200_OK)
        except Rentals.DoesNotExist:
            return Response({"msg": "Cannot get rental"},status=status.HTTP_404_NOT_FOUND)
        
        
class TriggerImageMatch(APIView):
    ''' Trigger Image Matching '''
    permission_classes = [IsAuthenticated]
    
    def get(self, request, rentalId):
        try:
            rental_exists = Rentals.objects.get(pk=rentalId)
            if(rental_exists):
                sum = 0
                try:
                    
                    ssim_scoresheet = run_matching(rental_id=rentalId)
                   
                    for key in ssim_scoresheet:
                        sum += ssim_scoresheet[key]
                    sum = round(sum / len(ssim_scoresheet.keys()), 2)
                    rental_exists.rental_matchscore = sum
                    return Response({'score' : sum}, status=status.HTTP_200_OK)
                except TypeError as e:
                    print(e)
                    return Response({'msg' : 'Could not run matching'}, status=status.HTTP_404_NOT_FOUND)
                
        except Rentals.DoesNotExist:
            return Response({'msg' : 'Rental does not exist'}, status=status.HTTP_404_NOT_FOUND)
        