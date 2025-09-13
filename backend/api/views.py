from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Review, Detail, Group
from .ser import DetailSer, ReviewSer, GroupSer

class CreateListDetail(ListCreateAPIView):
    queryset = Detail.objects.all()
    serializer_class = DetailSer


class RetrieveUpdateDestroyDetail(RetrieveUpdateDestroyAPIView):
    queryset = Detail.objects.all()
    serializer_class = DetailSer


@api_view(['GET', 'POST'])
def detail_reviews(request, detail_id):
    """Получить все комментарии для детали или создать новый"""
    try:
        detail = Detail.objects.get(id=detail_id)
    except Detail.DoesNotExist:
        return Response({'error': 'Деталь не найдена'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        reviews = Review.objects.filter(detail=detail)
        serializer = ReviewSer(reviews, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = request.data.copy()
        data['detail'] = detail_id
        serializer = ReviewSer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_review(request, review_id):
    """Удалить комментарий"""
    try:
        review = Review.objects.get(id=review_id)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Review.DoesNotExist:
        return Response({'error': 'Комментарий не найден'}, status=status.HTTP_404_NOT_FOUND)


# API для работы с группами
class CreateListGroup(ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSer


class RetrieveUpdateDestroyGroup(RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSer


@api_view(['GET'])
def group_details(request, group_id):
    """Получить все детали в группе"""
    try:
        group = Group.objects.get(id=group_id)
        details = Detail.objects.filter(group=group)
        serializer = DetailSer(details, many=True)
        return Response(serializer.data)
    except Group.DoesNotExist:
        return Response({'error': 'Группа не найдена'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def detail_status_choices(request):
    """Получить доступные статусы деталей"""
    choices = Detail.STATUS_CHOICES
    return Response(choices)