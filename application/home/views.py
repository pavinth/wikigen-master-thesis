import requests
from django.shortcuts import render
from django.urls import reverse
from rest_framework import status

from application.home import forms


def search(request):
    BASE_URL = 'http://0.0.0.0:8000'
    if request.method == 'POST':
        form = forms.ContactForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['article_title']
            check_url = BASE_URL + reverse('api:v1:utils:check_record', kwargs={'article_title': title})
            print(check_url)
            response = requests.get(check_url)

            if response.status_code == status.HTTP_200_OK:
                print(response.json())
            else:
                print('Article Not Found')
                # NOTE(Manish): Make a call to wikipedia API
                # return data to FE
    else:
        form = forms.ContactForm()
    return render(request, 'home/search.html', {'form': form})
