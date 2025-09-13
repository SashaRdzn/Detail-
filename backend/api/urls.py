from django.urls import path
from .views import (
    CreateListDetail, RetrieveUpdateDestroyDetail, detail_reviews, delete_review,
    CreateListGroup, RetrieveUpdateDestroyGroup, group_details, detail_status_choices
)
from .sse_views import detail_events

urlpatterns = [
    # Детали
    path('details', CreateListDetail.as_view()),
    path('detail/<int:pk>', RetrieveUpdateDestroyDetail.as_view()),
    path('detail/<int:detail_id>/reviews', detail_reviews),
    path('review/<int:review_id>', delete_review),
    
    # Группы
    path('groups', CreateListGroup.as_view()),
    path('group/<int:pk>', RetrieveUpdateDestroyGroup.as_view()),
    path('group/<int:group_id>/details', group_details),
    
    # Статусы
    path('detail-status-choices', detail_status_choices),
    
    # Server-Sent Events
    path('events', detail_events),
]
