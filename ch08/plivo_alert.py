# -*- coding: utf-8 -*-
import plivo

client = plivo.RestClient()
response = client.messages.create(
    src='16173406483',
    dst='16173863368',
    text='Test Message', )
print(response)