from fastapi import FastAPI, Request, Response
from starlette.concurrency import iterate_in_threadpool
from faker import Faker
from json2xml import json2xml
from json2xml.utils import readfromstring


fake = Faker()

request_handler = FastAPI()


@request_handler.middleware("http")
async def convert_json_to_xml(request: Request, call_next):
    response = await call_next(request)
    response_body = [chunk async for chunk in response.body_iterator]
    response.body_iterator = iterate_in_threadpool(iter(response_body))
    json = response_body[0].decode()
    xml = json2xml.Json2xml(readfromstring(
        json), wrapper="Response", pretty=True, item_wrap=False, attr_type=False).to_xml()
    return Response(content=xml, media_type="application/xml")


@request_handler.get("/python/customers", status_code=200)
def get_customers_info():
    customers = []
    for x in range(0, 40):
        customers.append({
            "Customer": {
                "Id": fake.uuid4(),
                "FirstName": fake.first_name(),
                "LastName": fake.last_name(),
                "Address": fake.address(),
                "Phone": fake.country_calling_code()+"".join([str(fake.random_int(0, 9)) for x in range(0, 10)]),
                "CreatedAt": fake.iso8601()
            }
        })
    return {"customers": customers}
