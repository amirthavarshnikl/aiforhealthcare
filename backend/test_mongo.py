from database.mongodb import reports_collection

data = {
    "report_name": "test_report",
    "status": "uploaded"
}

result = reports_collection.insert_one(data)

print("Inserted ID:", result.inserted_id)