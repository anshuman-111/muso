from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, DashboardSerializer
from .models import AppUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rental.models import Rentals
from django.db.models import Q
# Create your views here.


class RegisterView(APIView):
    ''' Create New User '''
    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        print(request.data)
        user_email_exists = AppUser.objects.filter(email=email).exists()
        user_username_exists = AppUser.objects.filter(username=username).exists()
        if not user_email_exists and not user_username_exists:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response({"msg": "User with this Username or Email already exists."}, status=status.HTTP_403_FORBIDDEN)
       
       

class LoginView(APIView):
    ''' Login User '''
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = AppUser.objects.filter(email=email).first()
        response = Response()
        print(user)
        if user is None:
            raise AuthenticationFailed("User Not Found")
        else:
            if not user.check_password(password):
                raise AuthenticationFailed("Incorrect Password")

        return response


class AuthTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        return token


class AuthTokenObtainPairView(TokenObtainPairView):
    ''' Get Access and Refresh Token Pair'''
    serializer_class = AuthTokenObtainPairSerializer


class SetDashboard(APIView):
    ''' Setting Dashboard details for user '''
    def post(self, request):
        try:
            email = request.data["email"]
            user = AppUser.objects.get(email=email)
            user.first_name = request.data["first_name"]
            user.last_name = request.data["last_name"]
            user.suburb = request.data["suburb"]
            user.username = request.data["username"]
            user.save(update_fields=["first_name", "last_name", "suburb"])
            return Response(status=status.HTTP_200_OK)
        except KeyError as err:
            print("Error occured", err)
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


class GetDashboard(APIView):
    ''' Fetching Dashboard details if they exist '''
    def get(self, request, username):
        try:
            user = AppUser.objects.get(username=username)
            response = Response(
                data={
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "suburb": user.suburb,
                },
                status=status.HTTP_200_OK,
            )
            return response
        except:
            print("Error occured")
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


# CHECK IF USER HAS ANY ACTIVE RENTALS..if yes cannot delete account
class DeleteAccount(APIView):
    ''' Delete User account if no active rentals exist for the given user'''
    def post(self, request, username):
        try:
            user = AppUser.objects.get(username=username)
            user_rentals = Rentals.objects.filter(
                Q(renter_id=user.id) | Q(owner_id=user.id))
            
            has_active_rentals = any(rental.is_rental_active for rental in user_rentals)
            
            if(has_active_rentals):
                return Response({'msg' : 'You still have active rentals.'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                user.delete()
                return Response({'msg' : 'Account deleted.'}, status=status.HTTP_200_OK,)
        except AppUser.DoesNotExist:
            return Response({'msg' : 'Account not found!'}, status=status.HTTP_404_NOT_FOUND)