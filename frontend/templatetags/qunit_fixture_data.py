import json
from django import template
from django import forms

from data_capture.forms import UploadWidget


register = template.Library()


class UploadTestsForm(forms.Form):
    file = forms.FileField(widget=UploadWidget(
        accept=('.csv', 'application/test')
    ))


class Step1TestsForm(forms.Form):
    foo = forms.CharField()
    file = forms.FileField(widget=UploadWidget)

    def render(self):
        return ''.join([
            '<form enctype="multipart/form-data" method="post"',
            ' data-step1-form',
            ' action="/post-stuff">',
            '  %s' % str(self.as_p()),
            '  <button type="submit">submit</button>',
            '</form>'
        ])


@register.simple_tag
def qunit_fixture_data_json():
    data = {
        'UPLOAD_TESTS_HTML': str(UploadTestsForm()['file']),
        'STEP_1_TESTS_HTML': Step1TestsForm().render()
    }

    return json.dumps(data)
