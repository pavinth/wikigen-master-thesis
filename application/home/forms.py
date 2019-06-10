from django import forms


class ContactForm(forms.Form):
    article_title = forms.CharField(label='Enter a title', max_length=64)
