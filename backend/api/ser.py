from rest_framework.serializers import ModelSerializer
from .models import Review, Detail


class ReviewSer(ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class DetailSer(ModelSerializer):
    reviews = ReviewSer(many=True, read_only=True)
    
    class Meta:
        model = Detail
        fields = '__all__'