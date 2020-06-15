from django import forms

class LoginForm(forms.Form):
        username = forms.CharField(label=(u'username'), max_length=30)
        password = forms.CharField(label=(u'Pass'), widget=forms.PasswordInput(render_value=False), max_length=30)