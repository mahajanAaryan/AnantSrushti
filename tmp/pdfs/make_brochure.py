from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw
from pathlib import Path

ROOT=Path.cwd(); OUT=ROOT/'output/pdf/anant-srushti-hotel-brochure.pdf'; TMP=ROOT/'tmp/pdfs'; TMP.mkdir(parents=True,exist_ok=True)
W,H=A4
GREEN=HexColor('#173D32'); DEEP=HexColor('#102A24'); SAGE=HexColor('#6E8A69'); GOLD=HexColor('#D2AD69'); CREAM=HexColor('#F5F0E5'); INK=HexColor('#24352E'); MUTED=HexColor('#64736A')
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic','C:/Windows/Fonts/ariali.ttf'))
pdfmetrics.registerFont(TTFont('Georgia','C:/Windows/Fonts/georgia.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Bold','C:/Windows/Fonts/georgiab.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Italic','C:/Windows/Fonts/georgiai.ttf'))
P=canvas.Canvas(str(OUT),pagesize=A4)
P.setTitle('Anant Srushti Agro Tourism - Sahyadri Retreat')
P.setAuthor('Anant Srushti Agro Tourism')

def img_crop(src, name, size):
    im=Image.open(ROOT/src).convert('RGB'); tw,th=size; scale=max(tw/im.width,th/im.height); nw,nh=int(im.width*scale),int(im.height*scale); im=im.resize((nw,nh),Image.Resampling.LANCZOS); x=(nw-tw)//2; y=(nh-th)//2; im=im.crop((x,y,x+tw,y+th)); dest=TMP/name; im.save(dest,quality=92); return str(dest)
def photo(src,x,y,w,h,name):
    p=img_crop(src,name,(int(w*2),int(h*2))); P.drawImage(p,x,y,w,h,mask='auto')
def txt(s,x,y,size=10,color=INK,font='Arial'):
    P.setFillColor(color); P.setFont(font,size); P.drawString(x,y,s)
def right(s,x,y,size=9,color=MUTED,font='Arial'):
    P.setFillColor(color); P.setFont(font,size); P.drawRightString(x,y,s)
def wrap(s,x,y,width,size=10,leading=14,color=INK,font='Arial'):
    words=s.split(); lines=[]; line=''
    for word in words:
        test=(line+' '+word).strip()
        if pdfmetrics.stringWidth(test,font,size)<=width: line=test
        else: lines.append(line); line=word
    if line: lines.append(line)
    P.setFillColor(color); P.setFont(font,size)
    for l in lines: P.drawString(x,y,l); y-=leading
    return y
def bg(color=CREAM): P.setFillColor(color); P.rect(0,0,W,H,fill=1,stroke=0)
def header(section,title,sub=None):
    txt(section.upper(),42,H-48,8,GOLD,'Arial-Bold'); txt(title,42,H-82,25,GREEN,'Georgia-Bold')
    if sub: wrap(sub,42,H-103,W-84,10,14,MUTED)
def footer(n):
    P.setStrokeColor(HexColor('#D9D3C5')); P.line(42,35,W-42,35); txt('ANANT SRUSHTI  /  MAJGAON, VELHE',42,20,7,MUTED,'Arial-Bold'); right(f'{n:02d}',W-42,20,8,GREEN,'Arial-Bold')
def pill(s,x,y):
    P.setFillColor(HexColor('#E4E8DC')); P.roundRect(x,y,110,22,11,fill=1,stroke=0); txt(s,x+10,y+7,8,GREEN,'Arial-Bold')
def card(x,y,w,h,title,body,price=None):
    P.setFillColor(white); P.roundRect(x,y,w,h,9,fill=1,stroke=0); txt(title,x+14,y+h-24,12,GREEN,'Arial-Bold')
    yy=y+h-43
    if price: txt(price,x+14,yy,15,GREEN,'Arial-Bold'); yy-=19
    wrap(body,x+14,yy,w-28,8.5,12,MUTED)

# Cover
photo('Images/Drone pic 4.jpg',0,0,W,H,'cover.jpg'); P.setFillColor(HexColor('#102A24')); P.setFillAlpha(.53); P.rect(0,0,W,H,fill=1,stroke=0); P.setFillAlpha(1)
logo=ROOT/'assets/images/logo.png'
try:
    from PIL import Image as PILImage
    logo_im=PILImage.open(logo).convert('RGBA')
    logo_crop=logo_im.crop(logo_im.getbbox())
    logo_file=TMP/'cover-logo.png'; logo_crop.save(logo_file)
    P.drawImage(str(logo_file),42,H-126,width=75,height=60.2,mask='auto')
except: pass
txt('ANANT SRUSHTI',42,H-175,10,GOLD,'Arial-Bold'); txt('AGRO TOURISM',42,H-194,8,white,'Arial-Bold')
P.setStrokeColor(GOLD); P.setLineWidth(1); P.line(42,H-224,120,H-224)
txt('Where forests',42,H-291,34,white,'Georgia-Bold'); txt('meet the open sky',42,H-332,32,white,'Georgia-Bold')
wrap('A relaxed Sahyadri escape for slow mornings, fresh local food and evenings under the stars.',42,H-370,400,13,19,white)
P.setFillColor(GOLD); P.roundRect(42,88,185,32,16,fill=1,stroke=0); P.setFillColor(DEEP); P.setFont('Arial-Bold',8); P.drawCentredString(42+92.5,102,'A NATURE RETREAT NEAR PUNE')
txt('MAJGAON  /  VELHE TALUKA  /  PUNE DISTRICT',42,55,8,white,'Arial-Bold'); P.showPage()

# Stay
bg(); header('Stay','Find your kind of escape','Choose an open-sky tent or a comfortable room package. Rates shown are per adult, per day, as listed in the project booking information.')
photo('Images/Room/Mezza1.jpg',42,455,245,235,'stay.jpg')
photo('Images/IMG-20261104-WA0008.jpg',303,455,250,235,'tent.jpg')
# captions
for x,title,body in [(42,'ROOM STAYS','Four guest rooms, including family-friendly air-conditioned suites with valley and fort views.'),(303,'NATURE TENTS','Spacious tents with beds, blankets and power points, set beneath open skies for clear-night stargazing.')]:
 txt(title,x,438,8,GOLD,'Arial-Bold'); wrap(body,x,420,235,9,13,INK)
card(42,210,164,135,'Nature Tent','Dinner and next-day breakfast included. BBQ available as an add-on.','₹2,000 / adult / day')
card(218,210,164,135,'Standard Room','High tea and snacks, dinner, and next-day breakfast included.','₹3,000 / adult / day')
card(394,210,159,135,'Premium Room','High tea and snacks, veg and non-veg BBQ, dinner, and breakfast.','₹3,500 / adult / day')
# child rates strip
P.setFillColor(GREEN); P.roundRect(42,94,W-84,91,8,fill=1,stroke=0); txt('CHILD RATES  /  PER DAY',58,161,8,GOLD,'Arial-Bold')
txt('Tent  ₹1,200',58,138,10,white,'Arial-Bold'); txt('Standard  ₹1,500',220,138,10,white,'Arial-Bold'); txt('Premium  ₹1,800',394,138,10,white,'Arial-Bold')
txt('Ages 5-12. Children under 5 stay free. Lunch is available as an add-on with all packages.',58,115,8,HexColor('#E2E7DF'))
footer(2); P.showPage()

# Experience
bg(); header('Experiences','Make room for the outdoors','Spend the day in the water, on a trail or simply taking in the changing Sahyadri light.')
photo('Images/infinity pool3.jpg',42,405,330,315,'pool.jpg'); photo('Images/IMG-20261104-WA0049.jpg',390,570,163,150,'waterfall.jpg'); photo('Images/IMG-20261105-WA0007.jpg',390,405,163,150,'sky.jpg')
# right photo labels
txt('SEASONAL WATERFALL',390,561,8,GREEN,'Arial-Bold'); txt('NIGHT SKY & TENTS',390,390,8,GREEN,'Arial-Bold')
cols=[(42,'01  /  WATER','Infinity pool with valley views, plus a Jacuzzi and a dedicated kids’ pool. The private waterfall flows during the monsoon, typically July through September.'),(224,'02  /  NIGHT SKY','Open viewing areas invite stargazing and night photography. Clear skies and seasonal conditions shape what you may see.'),(406,'03  /  MOVE & PLAY','Nature walks, fort trekking, archery, cricket, football, table tennis, carrom, chess and a kids’ play area.')]
for x,t,b in cols:
 txt(t,x,337,9,GOLD,'Arial-Bold'); wrap(b,x,316,145,8.5,12,INK)
P.setFillColor(HexColor('#E4E8DC')); P.roundRect(42,90,W-84,69,8,fill=1,stroke=0); txt('FOR FAMILIES, FRIENDS & GROUPS',58,136,9,GREEN,'Arial-Bold'); wrap('Add a campfire, seasonal farm activities or an outdoor BBQ to your stay. Premium includes BBQ; for other packages, ask about arranging it as an add-on.',58,118,W-116,9,13,INK)
footer(3); P.showPage()

# Food & day
bg(); header('Food & slow days','A taste of the Sahyadri','Rajgad Restaurant serves home-style Maharashtrian and Punjabi favourites with organically grown and locally sourced ingredients.')
photo('Images/Hall1.jpg',42,425,246,270,'dining.jpg'); photo('Images/IMG-20261104-WA0010.jpg',306,425,247,270,'view.jpg')
# menu panel
P.setFillColor(GREEN); P.roundRect(42,245,W-84,145,9,fill=1,stroke=0); txt('ON THE TABLE',58,364,9,GOLD,'Arial-Bold')
for x,heading,content in [(58,'Morning','Poha, misal, upma, idli, sandwiches, tea and coffee.'),(226,'Local meals','Maharashtrian thalis, bhakri, roti, rice, seasonal vegetables and curries.'),(394,'Favourites','Punjabi dishes, snacks and veg or non-veg BBQ by arrangement.')]:
 txt(heading,x,338,11,white,'Arial-Bold'); wrap(content,x,318,135,8.5,12,HexColor('#E2E7DF'))
txt('A GENTLE TWO-DAY RHYTHM',42,210,9,GOLD,'Arial-Bold')
# mini itinerary
items=[('1:00 PM','Arrive and settle in'),('Afternoon','Lunch, leisure and pool time'),('Evening','Tea, trails, games or farm time'),('Night','BBQ / campfire, dinner and stars'),('Next morning','Nature walk, breakfast and 10:00 AM checkout')]
y=183
for time,label in items:
 P.setFillColor(GOLD); P.circle(49,y+3,3,fill=1,stroke=0); txt(time,62,y,8,GREEN,'Arial-Bold'); txt(label,147,y,8,INK); y-=25
wrap('Meal inclusions vary by package. Lunch and some BBQ arrangements are add-ons; confirm preferences while booking.',42,47,W-84,8,11,MUTED)
footer(4); P.showPage()

# Visit & contact
bg(DEEP)
txt('PLAN YOUR VISIT',42,H-56,8,GOLD,'Arial-Bold'); txt('Your Sahyadri stay',42,H-96,27,white,'Georgia-Bold'); wrap('A quiet hillside setting in Majgaon, around 75 km from Pune (approximately a two-hour drive).',42,H-120,430,11,16,HexColor('#E2E7DF'))
P.setFillColor(HexColor('#23483D')); P.roundRect(42,500,W-84,140,10,fill=1,stroke=0)
txt('GETTING HERE',60,613,9,GOLD,'Arial-Bold'); wrap('From Pune, follow the route towards Nasrapur and Velhe, then continue to Majgaon. Search “Anant Srushti Agro Tourism Majgaon” in Google Maps for navigation.',60,590,W-120,9,14,white)
txt('OPEN DIRECTIONS IN GOOGLE MAPS',60,523,9,GOLD,'Arial-Bold'); P.linkURL('https://www.google.com/maps/search/?api=1&query=AnantSrushti%20Agro%20Tourism%20Velhe%20Majgaon',(56,516,310,537),relative=0,thousands=0)
txt('BEFORE YOU ARRIVE',42,465,9,GOLD,'Arial-Bold')
card(42,361,245,81,'Advance reservation','The resort is reservation-only. Confirm your booking before travel; walk-ins cannot be accommodated.')
card(303,361,250,81,'Arrival & departure','Check-in: 1:00 PM    /    Check-out: 10:00 AM')
txt('BOOKING & ENQUIRIES',42,312,9,GOLD,'Arial-Bold'); txt('Call / WhatsApp',42,284,8,HexColor('#E2E7DF'))
phone1='+91 95884 29901'; phone2='+91 98222 43348'
txt(phone1,42,262,13,white,'Arial-Bold'); P.linkURL('https://wa.me/919588429901',(40,258,42+pdfmetrics.stringWidth(phone1,'Arial-Bold',13),278),relative=0,thousands=0)
txt(phone2,42,241,13,white,'Arial-Bold'); P.linkURL('https://wa.me/919822243348',(40,237,42+pdfmetrics.stringWidth(phone2,'Arial-Bold',13),257),relative=0,thousands=0)
txt('Email',42,218,8,HexColor('#E2E7DF')); txt('shrushtianant@gmail.com',42,199,11,white,'Arial-Bold')
txt('Majgaon, Velhe Taluka, Dist. Pune - 412212, Maharashtra, India',42,166,8,HexColor('#E2E7DF'))
P.setStrokeColor(HexColor('#557568')); P.line(42,58,W-42,58); txt('ANANT SRUSHTI  /  WHERE FORESTS MEET THE OPEN SKY',42,39,7,GOLD,'Arial-Bold'); right('05',W-42,39,8,white,'Arial-Bold')
P.showPage(); P.save()
print(OUT)
