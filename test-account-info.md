# Test Account Information

## Account Details
- **Business Name**: Test Marketing Agency
- **Email**: test@marketing.com
- **Password**: Mohammed93!!
- **Phone**: +46701234567
- **Account ID**: 2
- **Status**: ✅ Account created and verified

## Test Customers Created
1. **John Smith**
   - Email: john@example.com
   - Phone: +46701234567
   - Consent: Given
   - Source: NFC Tap

2. **Maria Garcia**
   - Email: maria@example.com
   - Phone: +46709876543
   - Consent: Given
   - Source: Website

## Available Services
- ✅ **Authentication**: Business account login/logout
- ✅ **Database**: Customer and campaign storage
- ✅ **SMS Integration**: HelloSMS API with Basic Auth
- ✅ **AI Campaign Generation**: OpenAI GPT-4o for content creation
- ✅ **Campaign Management**: Create, execute, and track campaigns

## Test API Endpoints

### Authentication
```bash
# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "test@marketing.com", "password": "testpass123"}'

# Get current business info
curl -X GET http://localhost:5000/api/auth/me -b cookies.txt
```

### SMS Testing
```bash
# Test SMS sending
curl -X POST http://localhost:5000/api/test/sms \
  -H "Content-Type: application/json" \
  -d '{"to": "+46701234567", "message": "Test SMS message"}'
```

### AI Campaign Generation
```bash
# Generate AI campaign
curl -X POST http://localhost:5000/api/campaigns/generate \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Marketing Agency",
    "campaignType": "sms",
    "campaignGoal": "promotion",
    "tone": "friendly",
    "keyMessage": "Special discount available"
  }'
```

### Customer Management
```bash
# Get customers
curl -X GET http://localhost:5000/api/customers -b cookies.txt

# Add customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "New Customer",
    "email": "new@example.com",
    "phone": "+46701111111",
    "consentGiven": true,
    "source": "nfc_tap"
  }'
```

## Frontend Access
- Visit http://localhost:5000/ to access the web interface
- Navigate to /ai-campaigns for AI campaign generation
- Use business signup/signin pages for authentication

## Integration Status
- 🟢 Database: PostgreSQL with Drizzle ORM ✅ TESTED WORKING
- 🟢 SMS: HelloSMS with Basic Auth credentials ✅ TESTED WORKING  
- 🟢 AI: OpenAI GPT-4o for campaign generation ✅ TESTED WORKING
- 🟡 Email: Service ready (needs SMTP credentials)
- 🟡 WhatsApp: Not implemented yet

## Working Test Results
✅ **AI Campaign Generation**: Generated personalized welcome message with 25 words, high engagement
✅ **AI Campaign Enhancement**: Improved basic message with engagement and CTA optimization  
✅ **SMS Service**: HelloSMS integration confirmed working with real API
✅ **Database**: PostgreSQL connection and queries working properly
✅ **Authentication**: Business account created and authenticated successfully