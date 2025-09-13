class RemoveHopByHopHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.hop_by_hop_headers = [
            'connection', 'keep-alive', 'proxy-authenticate',
            'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade'
        ]

    def __call__(self, request):
        response = self.get_response(request)
        for header in self.hop_by_hop_headers:
            if header in response:
                del response[header]
                
        return response