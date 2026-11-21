from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE
from PIL import Image
from pathlib import Path

ROOT=Path.cwd(); OUT=ROOT/'output/pdf/anant-srushti-hotel-brochure.docx'; TMP=ROOT/'tmp/pdfs'; TMP.mkdir(parents=True,exist_ok=True)
GREEN='173D32'; DEEP='102A24'; GOLD='C69E55'; CREAM='F5F0E5'; PALE='E7EBDD'; MUTED='617068'; INK='202D28'; WHITE='FFFFFF'; LIGHT='DDE5DB'

doc=Document(); sec=doc.sections[0]
sec.page_width=Inches(8.27); sec.page_height=Inches(11.69); sec.top_margin=Inches(.58); sec.bottom_margin=Inches(.62); sec.left_margin=Inches(.68); sec.right_margin=Inches(.68); sec.header_distance=Inches(.25); sec.footer_distance=Inches(.28)
styles=doc.styles
normal=styles['Normal']; normal.font.name='Aptos'; normal.font.size=Pt(10); normal.font.color.rgb=RGBColor.from_string(INK); normal.paragraph_format.space_after=Pt(5); normal.paragraph_format.line_spacing=1.1
for nm,size in [('Title',30),('Heading 1',23),('Heading 2',13),('Heading 3',10)]:
 st=styles[nm]; st.font.name='Georgia' if nm!='Heading 3' else 'Aptos Display'; st.font.size=Pt(size); st.font.bold=True; st.font.color.rgb=RGBColor.from_string('000000' if nm=='Title' else GREEN); st.paragraph_format.space_before=Pt(0); st.paragraph_format.space_after=Pt(6); st.paragraph_format.keep_with_next=True
# Compact utility style
if 'Brochure Small' not in styles:
 st=styles.add_style('Brochure Small',WD_STYLE_TYPE.PARAGRAPH); st.font.name='Aptos'; st.font.size=Pt(8); st.font.color.rgb=RGBColor.from_string(MUTED); st.paragraph_format.space_after=Pt(3)

def shade(cell,color):
 tcPr=cell._tc.get_or_add_tcPr(); shd=OxmlElement('w:shd'); shd.set(qn('w:fill'),color); tcPr.append(shd)
def margins(cell,top=120,start=140,bottom=120,end=140):
 tc=cell._tc; tcPr=tc.get_or_add_tcPr(); mar=tcPr.first_child_found_in('w:tcMar')
 if mar is None: mar=OxmlElement('w:tcMar'); tcPr.append(mar)
 for tag,val in [('top',top),('start',start),('bottom',bottom),('end',end)]:
  node=mar.find(qn('w:'+tag))
  if node is None: node=OxmlElement('w:'+tag); mar.append(node)
  node.set(qn('w:w'),str(val)); node.set(qn('w:type'),'dxa')
def set_width(cell,inches): cell.width=Inches(inches)
def fixed_table(table,widths):
 table.autofit=False; table.alignment=WD_TABLE_ALIGNMENT.CENTER
 tblPr=table._tbl.tblPr; layout=OxmlElement('w:tblLayout'); layout.set(qn('w:type'),'fixed'); tblPr.append(layout)
 for row in table.rows:
  for cell,w in zip(row.cells,widths): set_width(cell,w); cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER; margins(cell)
def set_repeat_keep(table):
 for row in table.rows:
  trPr=row._tr.get_or_add_trPr(); trPr.append(OxmlElement('w:cantSplit'))
def pformat(p,before=0,after=0,line=1.05):
 p.paragraph_format.space_before=Pt(before); p.paragraph_format.space_after=Pt(after); p.paragraph_format.line_spacing=line

def add_text(p,text,size=10,color=INK,font='Aptos',bold=False,italic=False):
 r=p.add_run(text); r.font.name=font; r.font.size=Pt(size); r.font.color.rgb=RGBColor.from_string(color); r.bold=bold; r.italic=italic
 return r
def para(text='',size=10,color=INK,font='Aptos',bold=False,italic=False,align=None,before=0,after=5):
 p=doc.add_paragraph(); pformat(p,before,after); 
 if align is not None: p.alignment=align
 if text: add_text(p,text,size,color,font,bold,italic)
 return p
def cell_text(cell,lines,fill=None,align=WD_ALIGN_PARAGRAPH.LEFT):
 if fill: shade(cell,fill)
 cell.text=''; p=cell.paragraphs[0]; p.alignment=align; pformat(p,0,2,1.08)
 for i,(text,size,color,font,bold) in enumerate(lines):
  if i: p.add_run().add_break()
  add_text(p,text,size,color,font,bold)
 margins(cell)
 return cell

def section_label(text):
 p=para(text.upper(),8,GOLD,'Aptos Display',True,after=5); return p
def heading(text,sub=None):
 p=doc.add_paragraph(style='Heading 1'); pformat(p,0,4,1.0); add_text(p,text,23,GREEN,'Georgia',True)
 if sub: para(sub,9,MUTED,after=9)
 return p
def picture(path,width):
 p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(p,0,0,1)
 p.add_run().add_picture(str(ROOT/path),width=Inches(width))
 return p
def image_crop(src,name,size):
 im=Image.open(ROOT/src).convert('RGB'); tw,th=size; scale=max(tw/im.width,th/im.height); nw,nh=int(im.width*scale),int(im.height*scale); im=im.resize((nw,nh),Image.Resampling.LANCZOS); x=(nw-tw)//2; y=(nh-th)//2; dest=TMP/name; im.crop((x,y,x+tw,y+th)).save(dest,quality=92); return dest
def page_break(): doc.add_page_break()
def hyperlink(paragraph,text,url,color=GOLD,size=10):
 part=paragraph.part; rid=part.relate_to(url,'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',is_external=True)
 h=OxmlElement('w:hyperlink'); h.set(qn('r:id'),rid); r=OxmlElement('w:r'); pr=OxmlElement('w:rPr'); c=OxmlElement('w:color'); c.set(qn('w:val'),color); pr.append(c); b=OxmlElement('w:b'); pr.append(b); sz=OxmlElement('w:sz'); sz.set(qn('w:val'),str(int(size*2))); pr.append(sz); r.append(pr); t=OxmlElement('w:t'); t.text=text; r.append(t); h.append(r); paragraph._p.append(h)

# Running footer with a subtle brand signature and page number field.
f=sec.footer.paragraphs[0]; f.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(f,0,0)
add_text(f,'ANANT SRUSHTI  |  MAJGAON, VELHE  |  ',7,MUTED,'Aptos Display',True)
fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); f._p.append(fld)

# PAGE 1 - cover
logo=ROOT/'assets/images/logo.png'; lp=doc.add_paragraph(); lp.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(lp,0,0); lp.add_run().add_picture(str(logo),width=Inches(1.55))
para('ANANT SRUSHTI AGRO TOURISM',9,GOLD,'Aptos Display',True,align=WD_ALIGN_PARAGRAPH.CENTER,after=8)
hero=image_crop('Images/Drone pic 4.jpg','word-cover.jpg',(1400,800)); picture(hero.relative_to(ROOT),6.85)
p=doc.add_paragraph(style='Title'); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(p,12,2,1.0); add_text(p,'Where forests meet the open sky',27,'000000','Georgia',True)
para('A relaxed Sahyadri escape for slow mornings, fresh local food and evenings under the stars.',11,MUTED,'Aptos',False,align=WD_ALIGN_PARAGRAPH.CENTER,after=12)
t=doc.add_table(rows=1,cols=3); fixed_table(t,[2.28,2.28,2.28]); set_repeat_keep(t)
for c,(big,small) in zip(t.rows[0].cells,[('75 km','FROM PUNE'),('4 ROOMS','ROOM STAYS'),('BY RESERVATION','ADVANCE BOOKING')]): cell_text(c,[(big,12,GREEN,'Aptos Display',True),(small,7,MUTED,'Aptos Display',True)],PALE,WD_ALIGN_PARAGRAPH.CENTER)
para('MAJGAON  |  VELHE TALUKA  |  PUNE DISTRICT, MAHARASHTRA',8,MUTED,'Aptos Display',True,align=WD_ALIGN_PARAGRAPH.CENTER,before=10,after=0)

# PAGE 2 - accommodations
page_break(); section_label('Stay'); heading('Choose your Sahyadri stay','Four guest rooms and open-sky tents offer two relaxed ways to spend the night.')
# Balanced room/tent image row
pics=doc.add_table(rows=1,cols=2); fixed_table(pics,[3.42,3.42]); set_repeat_keep(pics)
for cell,src,name,caption in zip(pics.rows[0].cells,['Images/Room/Mezza1.jpg','Images/IMG-20261104-WA0008.jpg'],['room-card.jpg','tent-card.jpg'],['ROOM STAYS','NATURE TENTS']):
 cell.text=''; p=cell.paragraphs[0]; p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(p); p.add_run().add_picture(str(image_crop(src,name,(800,440))),width=Inches(3.24)); q=cell.add_paragraph(); pformat(q,4,0); add_text(q,caption,8,GOLD,'Aptos Display',True)
para('Four guest rooms include comfortable options and family-friendly air-conditioned suites with views of the valley and surrounding forts. Nature tents have beds, blankets and power points, set beneath open skies.',9,INK,after=8)
section_label('Packages and daily rates')
t=doc.add_table(rows=1,cols=3); fixed_table(t,[2.28,2.28,2.28]); set_repeat_keep(t)
plans=[('NATURE TENT','₹2,000','per adult / day','Dinner and next-day breakfast. BBQ can be arranged as an add-on.'),('STANDARD ROOM','₹3,000','per adult / day','Evening high tea and snacks, dinner, and next-day breakfast.'),('PREMIUM ROOM','₹3,500','per adult / day','High tea and snacks, veg and non-veg BBQ, dinner, and breakfast.')]
for c,(title,price,unit,body) in zip(t.rows[0].cells,plans):
 shade(c,PALE); c.text=''; margins(c,160,150,160,150); p=c.paragraphs[0]; pformat(p,0,5); add_text(p,title,8,GREEN,'Aptos Display',True); p=c.add_paragraph(); pformat(p,0,2); add_text(p,price,19,GREEN,'Georgia',True); p=c.add_paragraph(); pformat(p,0,5); add_text(p,unit,8,MUTED); p=c.add_paragraph(); pformat(p,0,0,1.08); add_text(p,body,8,INK)
para('Child rates per day: Tent ₹1,200  |  Standard ₹1,500  |  Premium ₹1,800. Ages 5-12; children under 5 stay free.',8,MUTED,before=7,after=4)
para('Lunch is an add-on for all packages. BBQ is included with Premium and can be arranged separately with Tent and Standard packages.',8,MUTED,after=0)

# PAGE 3 - experiences with image captions directly under images
page_break(); section_label('Experiences'); heading('Make room for the outdoors','Spend the day in the water, on a trail or taking in the changing Sahyadri light.')
# Wide pool hero plus two stacked image/caption cards on the right
photos=doc.add_table(rows=1,cols=2); fixed_table(photos,[4.05,2.79]); set_repeat_keep(photos)
c=photos.cell(0,0); c.text=''; p=c.paragraphs[0]; p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(p); p.add_run().add_picture(str(image_crop('Images/infinity pool3.jpg','word-pool.jpg',(900,1000))),width=Inches(3.9),height=Inches(4.1)); q=c.add_paragraph(); pformat(q,4,0); add_text(q,'INFINITY POOL  |  VALLEY VIEWS',8,GOLD,'Aptos Display',True)
c=photos.cell(0,1); c.text='';
for i,(src,name,cap) in enumerate([('Images/IMG-20261104-WA0049.jpg','word-falls.jpg','SEASONAL WATERFALL'),('Images/IMG-20261105-WA0007.jpg','word-night.jpg','NIGHT SKY & TENTS')]):
 p=c.paragraphs[0] if i==0 else c.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(p); p.add_run().add_picture(str(image_crop(src,name,(600,390))),width=Inches(2.56),height=Inches(1.66)); q=c.add_paragraph(); pformat(q,0,6); add_text(q,cap,8,GOLD,'Aptos Display',True)
# Experience highlights in evenly sized info cards
cards=doc.add_table(rows=1,cols=3); fixed_table(cards,[2.28,2.28,2.28]); set_repeat_keep(cards)
for cell,(title,body) in zip(cards.rows[0].cells,[('WATER','Infinity pool with valley views, Jacuzzi and a dedicated kids pool. The waterfall runs during monsoon, typically July through September.'),('NIGHT SKY','Open viewing areas for stargazing and night photography. What you see depends on clear skies and season.'),('MOVE & PLAY','Nature walks, fort trekking, archery, cricket, football, table tennis, carrom, chess and a kids play area.')]):
 shade(cell,'F5F0E5'); margins(cell,130,130,130,130); cell.text=''; p=cell.paragraphs[0]; pformat(p,0,4); add_text(p,title,8,GOLD,'Aptos Display',True); p=cell.add_paragraph(); pformat(p,0,0,1.06); add_text(p,body,8,INK)
para('Campfires, seasonal farm activities and outdoor BBQ can add to your stay. BBQ is included with Premium; ask about arranging it with other packages.',9,GREEN,bold=True,before=8,after=0)

# PAGE 4 - food and itinerary
page_break(); section_label('Food and slow days'); heading('A taste of the Sahyadri','Rajgad Restaurant serves home-style Maharashtrian and Punjabi favourites with organically grown and locally sourced ingredients.')
photos=doc.add_table(rows=1,cols=2); fixed_table(photos,[3.42,3.42]); set_repeat_keep(photos)
for cell,src,name,cap in zip(photos.rows[0].cells,['Images/Hall1.jpg','Images/IMG-20261104-WA0010.jpg'],['word-dining.jpg','word-view.jpg'],['RAJGAD RESTAURANT','SIT BACK WITH A VIEW']):
 cell.text=''; p=cell.paragraphs[0]; p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pformat(p); p.add_run().add_picture(str(image_crop(src,name,(800,500))),width=Inches(3.24)); q=cell.add_paragraph(); pformat(q,4,0); add_text(q,cap,8,GOLD,'Aptos Display',True)
# food categories grid
food=doc.add_table(rows=1,cols=3); fixed_table(food,[2.28,2.28,2.28]); set_repeat_keep(food)
for c,(title,body) in zip(food.rows[0].cells,[('MORNING','Poha, misal, upma, idli, sandwiches, tea and coffee.'),('LOCAL MEALS','Maharashtrian thalis, bhakri, roti, rice, seasonal vegetables and curries.'),('FAVOURITES','Punjabi dishes, snacks and veg or non-veg BBQ by arrangement.')]):
 shade(c,GREEN); margins(c,150,150,150,150); c.text=''; p=c.paragraphs[0]; pformat(p,0,4); add_text(p,title,8,'E6C783','Aptos Display',True); p=c.add_paragraph(); pformat(p,0,0,1.08); add_text(p,body,8,WHITE)
section_label('A gentle two-day rhythm')
# itinerary table aligns time labels with descriptions
it=doc.add_table(rows=5,cols=2); fixed_table(it,[1.45,5.39]); set_repeat_keep(it)
for row,(time,what) in zip(it.rows,[('1:00 PM','Arrive, settle in and enjoy lunch.'),('Afternoon','Explore the property, relax or take a dip in the pool.'),('Evening','High tea, trails, games or seasonal farm activities.'),('Night','BBQ or campfire, dinner and time under the stars.'),('Next morning','Nature walk, breakfast and 10:00 AM checkout.')]):
 cell_text(row.cells[0],[(time,9,GREEN,'Aptos Display',True)],PALE); cell_text(row.cells[1],[(what,9,INK,'Aptos',False)],'F7F7F2')
para('Meal inclusions vary by package. Lunch and some BBQ arrangements are add-ons; confirm preferences while booking.',8,MUTED,before=7,after=0)

# PAGE 5 - visit, booking and contact
page_break(); section_label('Plan your visit'); heading('Your Sahyadri stay','Anant Srushti is in Majgaon, Velhe Taluka, around 75 km from Pune - roughly a two-hour drive.')
route=doc.add_table(rows=1,cols=1); fixed_table(route,[6.84]); c=route.cell(0,0); shade(c,GREEN); margins(c,180,190,180,190); c.text=''; p=c.paragraphs[0]; pformat(p,0,4); add_text(p,'GETTING HERE',9,'E6C783','Aptos Display',True); p=c.add_paragraph(); pformat(p,0,6,1.08); add_text(p,'From Pune, head towards Nasrapur and Velhe, then continue to Majgaon. Search “Anant Srushti Agro Tourism Majgaon” in Google Maps.',9,WHITE); p=c.add_paragraph(); pformat(p,0,0); hyperlink(p,'OPEN DIRECTIONS IN GOOGLE MAPS','https://www.google.com/maps/search/?api=1&query=AnantSrushti%20Agro%20Tourism%20Velhe%20Majgaon')
section_label('Before you arrive')
info=doc.add_table(rows=1,cols=2); fixed_table(info,[3.42,3.42]); set_repeat_keep(info)
cell_text(info.cell(0,0),[('ADVANCE RESERVATION',9,GREEN,'Aptos Display',True),('The resort is reservation-only. Confirm your booking before travelling; walk-ins cannot be accommodated.',9,INK,'Aptos',False)],PALE)
cell_text(info.cell(0,1),[('ARRIVAL AND DEPARTURE',9,GREEN,'Aptos Display',True),('Check-in: 1:00 PM  |  Check-out: 10:00 AM',9,INK,'Aptos',False)],PALE)
section_label('Bookings and enquiries')
contact=doc.add_table(rows=1,cols=2); fixed_table(contact,[3.42,3.42]); set_repeat_keep(contact)
c=contact.cell(0,0); c.text=''; margins(c)
p=c.paragraphs[0]; pformat(p,0,3); add_text(p,'CALL OR WHATSAPP',8,GOLD,'Aptos Display',True)
p=c.add_paragraph(); pformat(p,0,3); hyperlink(p,'+91 95884 29901','https://wa.me/919588429901',GREEN,12)
p=c.add_paragraph(); pformat(p,0,0); hyperlink(p,'+91 98222 43348','https://wa.me/919822243348',GREEN,12)
c=contact.cell(0,1); c.text=''; margins(c)
p=c.paragraphs[0]; pformat(p,0,3); add_text(p,'EMAIL',8,GOLD,'Aptos Display',True)
p=c.add_paragraph(); pformat(p,0,0); add_text(p,'shrushtianant@gmail.com',11,GREEN,'Aptos Display',True)
para('Majgaon, Velhe Taluka, Dist. Pune - 412212, Maharashtra, India',9,MUTED,before=6,after=0)

# Set metadata and save
doc.core_properties.title='Anant Srushti Agro Tourism Hotel Brochure'
doc.core_properties.subject='Accommodation, experiences, dining and booking information'
doc.core_properties.author='Anant Srushti Agro Tourism'
doc.save(OUT)
print(OUT)
