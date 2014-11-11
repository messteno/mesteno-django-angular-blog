from rest_framework.views import exception_handler


def rest_exception_handler(exc):
    response = exception_handler(exc)

    if response is not None:
        response.data['form_errors'] = {'__all__':
                                        [u'Ошибка при обработке запроса']}

    return response
