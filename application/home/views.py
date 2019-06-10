import requests
from django.shortcuts import render
from django.urls import reverse
from rest_framework import status

from application.home import forms
from application.stats.api.v1.serializers import Revision
from application.stats.models import Revision, Article

BASE_URL = 'http://0.0.0.0:8000'
WIKI_BASE_URL = 'https://en.wikipedia.org/'
WIKI_URL = WIKI_BASE_URL + 'w/api.php?action=query&prop=revisions&format=json&rvlimit=max&rvprop=ids|timestamp|user&titles='


def search(request):

    if request.method == 'POST':
        form = forms.ContactForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['article_title']
            check_url = BASE_URL + reverse('api:v1:utils:check_record', kwargs={'article_title': title})
            response = requests.get(check_url)

            if response.status_code == status.HTTP_200_OK:
                print(response.json())
            else:
                print('Article Not Found! Making request to wiki api')
                # NOTE(Manish): Make a call to wikipedia API
                # return data to FE
                wiki_full_url = WIKI_URL + title
                wiki_response = requests.get(wiki_full_url)
                wiki_response_json = wiki_response.json()
                article_id = list(wiki_response_json['query']['pages'].keys())[0]
                article = {
                    'id': article_id,
                    'ns': wiki_response_json['query']['pages'][article_id]['ns'],
                    'title': wiki_response_json['query']['pages'][article_id]['title']
                }
                article_url = reverse('api:v1:stats:article-list')
                article_full_url = BASE_URL + article_url

                api_response = requests.post(article_full_url, data=article, json=True)

                if api_response.status_code == status.HTTP_201_CREATED:
                    revisions = wiki_response_json['query']['pages'][article_id]['revisions']
                    article = Article.objects.get(id=article_id)
                    revision_list = []
                    for revision in revisions:
                        rev_obj = Revision(title=article, **revision)
                        revision_list.append(rev_obj)
                    Revision.objects.bulk_create(revision_list)

    else:
        form = forms.ContactForm()
    return render(request, 'home/search.html', {'form': form})
