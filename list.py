import json

countries = []
with open("airports.json") as json_file:
    airports = json.load(json_file)
    for airport in airports:
        country = airport['country']
        if country not in countries:
            countries.append(country)

countries.sort()
print('[')
for country in countries:
    print(r'"{}"'.format(country) + ",")

print(']')
