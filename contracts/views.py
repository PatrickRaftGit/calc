from django.shortcuts import render
from django.http import Http404

from .reports import ALL_METRICS


MAX_EXAMPLES = 10

EXAMPLE_FIELDS = [
    'pk',
    'labor_category',
    'education_level',
    'min_years_experience',
    'current_price',
    'next_year_price',
    'second_year_price',
    'idv_piid',
    'vendor_name',
    'schedule',
    'contractor_site',
    'business_size',
    'contract_start',
    'contract_end',
    'contract_year',
    'hourly_rate_year1',
    'hourly_rate_year2',
    'hourly_rate_year3',
    'hourly_rate_year4',
    'hourly_rate_year5',
]


def data_quality_report(request):
    return render(request, 'data_quality_report.html', {
        'ALL_METRICS': ALL_METRICS,
    })


def data_quality_report_detail(request, slug):
    metrics = [metric for metric in ALL_METRICS if metric.slug == slug]
    if not metrics:
        raise Http404('Unknown metric')
    metric = metrics[0]
    queryset = metric.get_queryset()

    examples = []
    for contract in queryset[:MAX_EXAMPLES]:
        examples.append([
            getattr(contract, field) for field in EXAMPLE_FIELDS
        ])

    return render(request, 'data_quality_report_detail.html', {
        'metric': metric,
        'examples': examples,
        'EXAMPLE_FIELDS': EXAMPLE_FIELDS,
    })
