from django.shortcuts import render
from rental.models import Rentals
from rental.serializers import RentalCreateSerialzer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import date
# Create your views here.


        
class FilterBasedSearch(APIView):
    
    def get(self, request):
       
            rentals = Rentals.objects.filter(renter__isnull=True)
            
            query = request.query_params.get('search')
            max_price = request.query_params.get('max')
            min_price = request.query_params.get('min')
            suburb = request.query_params.get('suburb')
            available_from = request.query_params.get('from')
            
            
            min_price = float(min_price) if len(min_price)>0 else 0
            max_price = float(max_price) if len(max_price)>0 else 0
            print(request.query_params)
            if query:
                rentals = rentals.filter(Q(rental_instrument_type__icontains=query) | Q(rental_title__icontains=query))
            
            if max_price and max_price > 0:
                try:
                    
                    rentals = rentals.filter(rental_rate__lte=max_price)
                except ValueError:
                    return Response({'msg': 'Max Price not a float'}, status=status.HTTP_404_NOT_FOUND)
            if min_price and min_price > 0:
                try:
                    
                    rentals = rentals.filter(rental_rate__gte=min_price)
                except ValueError:
                    return Response({'msg': 'Min Price not a float'}, status=status.HTTP_404_NOT_FOUND)
            
            if suburb:
                rentals = rentals.filter(rental_location__icontains=suburb)
                
            if available_from:
                try:
                    formatted_avail_date = date.fromisoformat(available_from)
                    rentals = rentals.filter(rental_avail_start__gte=formatted_avail_date)
                except:
                    return Response({'msg': 'Date type conflict'}, status=status.HTTP_404_NOT_FOUND)
                
                
            print(rentals)
            serializer = RentalCreateSerialzer(instance=rentals, many=True)
            return Response( { 'results' : serializer.data} , status=status.HTTP_200_OK)
    