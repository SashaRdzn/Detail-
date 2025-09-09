from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Review, Detail
from .ser import DetailSer, ReviewSer

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