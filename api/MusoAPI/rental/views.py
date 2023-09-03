from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import RentalCreateSerialzer, RentalTakeSerialzer, RentalAllInfoSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Rentals
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
import boto3

# Create your views here.
class CreateRentalView(APIView):
    permission_classes= [IsAuthenticated]
    def post(self, request):
        serializer = RentalCreateSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rental = serializer.save()
        rental_id = rental.rental_id
        return Response(status=status.HTTP_200_OK, data=rental_id)




class DeleteRentalView(APIView):
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


# DEVELOPER VIEW - REMOVE FROM PRODUCTION
class ShowRentalsList(APIView):
    
    def get(self, request):
        try:
            rental = Rentals.objects.filter(renter__isnull=True)
        except Rentals.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RentalCreateSerialzer(instance=rental, many=True)
        return Response(serializer.data)


class GetRentalView(APIView):
    
    def get(self, request, rentalId):
        try:
            rental = Rentals.objects.get(pk=rentalId)
        except Rentals.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental)
        return Response(serializer.data)


class GetPostedRentalView(APIView):
    permission_classes= [IsAuthenticated]
    def get(self, request, userId):
        try:
            rental = Rentals.objects.filter(owner_id=userId)
        except Rentals.DoesNotExist:
            return Response({"msg": "Nothing here yet!"},status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental, many=True)
        return Response(serializer.data)
    
class GetTakenRentalView(APIView):
    permission_classes= [IsAuthenticated]
    def get(self, request, userId):
        try:
            rental = Rentals.objects.filter(renter=userId)
        except Rentals.DoesNotExist:
            return Response({"msg": "Nothing here yet!"},status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental, many=True)
        return Response(serializer.data)

class GetGivenRentalView(APIView):
    permission_classes= [IsAuthenticated]
    def get(self, request, userId):
        try:
            rental = Rentals.objects.filter(owner=userId, renter__isnull=False)
        except Rentals.DoesNotExist:
            return Response({"msg": "Nothing here yet!"},status=status.HTTP_404_NOT_FOUND)
        serializer = RentalAllInfoSerializer(instance=rental, many=True)
        return Response(serializer.data)


class TakeRental(APIView):
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
    permission_classes= [IsAuthenticated]
    def post(self, request, rentalId):
        try:
            rental = Rentals.objects.get(pk=rentalId)
            rental.rental_image_url = request.data["img_url"]
            rental.save()
            return Response({"msg": "Display picture uploaded"}, status=status.HTTP_200_OK)
        except Rentals.DoesNotExist:
            return Response({"msg": "Cannot get rental"},status=status.HTTP_404_NOT_FOUND)