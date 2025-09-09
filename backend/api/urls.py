from django.urls import path
from .views import CreateListDetail, RetrieveUpdateDestroyDetail, detail_reviews, delete_review

urlpatterns = [
    path('details', CreateListDetail.as_view()),
    path('detail/<int:pk>', RetrieveUpdateDestroyDetail.as_view()),
    path('detail/<int:detail_id>/reviews', detail_reviews),
    path('review/<int:review_id>', delete_review),
]
