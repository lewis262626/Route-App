#
#  Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
#  This file is licensed under the Apache License, Version 2.0 (the "License").
#  You may not use this file except in compliance with the License. A copy of
#  the License is located at
# 
#  http://aws.amazon.com/apache2.0/
# 
#  This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
#  CONDITIONS OF ANY KIND, either express or implied. See the License for the
#  specific language governing permissions and limitations under the License.
#
from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import decimal
import six
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

table = dynamodb.Table('airports')

def empty2string(obj):
    for k, v in six.iteritems(obj):
        if k == "runway_length" and v is None:
            obj[k] = 0
        elif v == '':
            obj[k] = 'NONE'
    return obj

with open("airports.json") as json_file:
    airports = json.load(json_file, object_hook=empty2string, parse_float = decimal.Decimal)
    for airport in airports:
        code = airport['code']
        lat = airport['lat']
        lon = airport['lon']
        name = airport['name']
        city = airport['city']
        state = airport['state']
        country = airport['country']
        woeid = airport['woeid']
        tz = airport['tz']
        type_airport = airport['type']
        icao = airport['icao']
        runway_length = Decimal(airport['runway_length'])
        elev = airport['elev']
        direct_flights = airport['direct_flights']
        carriers = airport['carriers']

        print("Adding airport:", name, code)


        table.put_item(
           Item={
               'icao': icao,
               'code': code,
               'lat': lat,
               'lon': lon,
               'name': name,
               'city': city,
               'state': state,
               'country': country,
               'woeid': woeid,
               'tz': tz,
               'type_airport': type_airport,
               'runway_length': runway_length,
               'elev': elev,
               'direct_flights': direct_flights,
               'carriers': carriers
            }
        )
