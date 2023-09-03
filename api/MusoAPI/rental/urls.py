from django.urls import path
from .views import (
    CreateRentalView,
    DeleteRentalView,
    GetRentalView,
    ShowRentalsList,
    GetPostedRentalView,
    GetTakenRentalView,
    GetGivenRentalView,
    TakeRental,
    ImageURLUpload
)

urlpatterns = [
    path("create", CreateRentalView.as_view()),
    path("delete/<rentalId>", DeleteRentalView.as_view()),
    path("rental/<rentalId>", GetRentalView.as_view()),
    path("feed", ShowRentalsList.as_view()),
    path("getposted/<userId>", GetPostedRentalView.as_view()),
    path("getgiven/<userId>", GetGivenRentalView.as_view()),
    path("gettaken/<userId>", GetTakenRentalView.as_view()),
    path("takerental/<rentalId>", TakeRental.as_view()),
    path("imageupload/<rentalId>", ImageURLUpload.as_view())
]
