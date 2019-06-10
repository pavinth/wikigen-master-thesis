from django.views.generic.base import TemplateView


class HomePageView(TemplateView):
    template_name = "article_selection.html"


class ArticlePageView(TemplateView):
    template_name = "article_page.html"


class EditPageView(TemplateView):
    template_name = "edit_statistics.html"


class AnchorPageView(TemplateView):
    template_name = "anchor_statistics.html"


class BlinkPageView(TemplateView):
    template_name = "blink_statistics.html"


class AboutPageView(TemplateView):
    template_name = "about.html"


class LoginPageView(TemplateView):
    template_name = "login.html"


class RegistrationPageView(TemplateView):
    template_name = "registration.html"


class DashboardPageView(TemplateView):
    template_name = "dashboard.html"
