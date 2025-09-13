from django.http import StreamingHttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import time
from .models import Detail, Group

@require_http_methods(["GET"])
def detail_events(request):
    def event_stream():
        last_detail_count = Detail.objects.count()
        last_group_count = Group.objects.count()
        
        while True:
            try:
                current_detail_count = Detail.objects.count()
                if current_detail_count != last_detail_count:
                    last_detail_count = current_detail_count
                    yield f"data: {json.dumps({'type': 'details_updated', 'count': current_detail_count})}\n\n"
                
                current_group_count = Group.objects.count()
                if current_group_count != last_group_count:
                    last_group_count = current_group_count
                    yield f"data: {json.dumps({'type': 'groups_updated', 'count': current_group_count})}\n\n"
                
                yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': int(time.time())})}\n\n"
                
                time.sleep(5)
                
            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
                break
    
    response = StreamingHttpResponse(
        event_stream(),
        content_type='text/event-stream'
    )
    response['Cache-Control'] = 'no-cache'
    response['Connection'] = 'keep-alive'
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Headers'] = 'Cache-Control'
    return response
