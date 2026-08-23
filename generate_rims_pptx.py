import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

ROOT_DIR = r"d:\SE Assignment-4"
OUTPUT_PPTX = os.path.join(ROOT_DIR, "RIMS_System_Specification.pptx")

# Professional Color Palette
COLOR_NAVY = RGBColor(15, 23, 42)       # #0F172A - Deep Slate/Navy
COLOR_PRIMARY = RGBColor(37, 99, 235)   # #2563EB - Royal Blue
COLOR_DARK_BLUE = RGBColor(30, 64, 175) # #1E40AF - Dark Blue
COLOR_ACCENT = RGBColor(14, 165, 233)   # #0EA5E9 - Sky Blue
COLOR_EMERALD = RGBColor(16, 185, 129)  # #10B981 - Green
COLOR_AMBER = RGBColor(245, 158, 11)    # #F59E0B - Amber
COLOR_ROSE = RGBColor(239, 68, 68)      # #EF4444 - Red
COLOR_BG_LIGHT = RGBColor(248, 250, 252)# #F8FAFC - Off-white
COLOR_CARD_BG = RGBColor(241, 245, 249) # #F1F5F9 - Card Gray
COLOR_BORDER = RGBColor(203, 213, 225)  # #CBD5E1 - Border
COLOR_TEXT_MAIN = RGBColor(15, 23, 42)  # #0F172A
COLOR_TEXT_MUTED = RGBColor(71, 85, 105)# #475569
COLOR_WHITE = RGBColor(255, 255, 255)

TOTAL_SLIDES = 13

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title_text, category_text="PROTOTYPE SYSTEM SPECIFICATION", is_dark=False):
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = COLOR_NAVY if not is_dark else RGBColor(10, 15, 30)
        top_bar.line.color.rgb = COLOR_PRIMARY
        top_bar.line.width = Pt(0)

        accent_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.13), Inches(13.333), Inches(0.04))
        accent_line.fill.solid()
        accent_line.fill.fore_color.rgb = COLOR_PRIMARY
        accent_line.line.fill.background()

        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.12), Inches(11.5), Inches(0.3))
        tf_cat = cat_box.text_frame
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ACCENT
        p_cat.font.name = "Arial"

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.38), Inches(11.5), Inches(0.65))
        tf_title = title_box.text_frame
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE
        p_title.font.name = "Arial"

    def add_footer(slide, slide_num):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(11.733), Inches(0.3))
        tf = footer_box.text_frame
        p = tf.paragraphs[0]
        p.text = f"Refrigerator & Pantry Inventory System Prototype   •   Slide {slide_num} of {TOTAL_SLIDES}"
        p.font.size = Pt(9)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.font.name = "Arial"

    def create_card(slide, left, top, width, height, title, header_bg=COLOR_PRIMARY):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_WHITE
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1)

        hbar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(0.42))
        hbar.fill.solid()
        hbar.fill.fore_color.rgb = header_bg
        hbar.line.fill.background()
        tf_h = hbar.text_frame
        p_h = tf_h.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_WHITE
        p_h.alignment = PP_ALIGN.CENTER
        return card

    # ==========================================
    # SLIDE 1: TITLE SLIDE (Dark Theme)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_NAVY
    bg1.line.fill.background()

    tag1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(4.2), Inches(0.45))
    tag1.fill.solid()
    tag1.fill.fore_color.rgb = RGBColor(30, 41, 59)
    tag1.line.color.rgb = COLOR_PRIMARY
    tag1.line.width = Pt(1.5)
    p_tag = tag1.text_frame.paragraphs[0]
    p_tag.text = "PROTOTYPE SPECIFICATION & BLUEPRINT"
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = COLOR_ACCENT
    p_tag.alignment = PP_ALIGN.CENTER

    t_box1 = s1.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(11.3), Inches(2.2))
    tf1 = t_box1.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "Refrigerator & Pantry Inventory System"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Smart Food Tracking, Category-Filtered Stock Management, Expiration Telemetry & Auto-Reordering"
    p1_sub.font.size = Pt(16)
    p1_sub.font.color.rgb = RGBColor(203, 213, 225)
    p1_sub.space_before = Pt(12)

    meta_info = [
        ("CORE STACK", "Node / Express / SQLite"),
        ("FRONTEND", "React 18 + Vite"),
        ("CATEGORIES", "6 Food Groups"),
        ("STATUS", "Fully Built & Live")
    ]
    for idx, (label, val) in enumerate(meta_info):
        m_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0 + idx * 2.9), Inches(5.2), Inches(2.7), Inches(1.2))
        m_card.fill.solid()
        m_card.fill.fore_color.rgb = RGBColor(30, 41, 59)
        m_card.line.color.rgb = RGBColor(51, 65, 85)
        tf_m = m_card.text_frame
        p_l = tf_m.paragraphs[0]
        p_l.text = label
        p_l.font.size = Pt(10)
        p_l.font.bold = True
        p_l.font.color.rgb = COLOR_ACCENT
        p_v = tf_m.add_paragraph()
        p_v.text = val
        p_v.font.size = Pt(13)
        p_v.font.bold = True
        p_v.font.color.rgb = COLOR_WHITE
        p_v.space_before = Pt(4)
    add_footer(s1, 1)

    # ==========================================
    # SLIDE 2: SCOPE & CORE FEATURES
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "1. Executive Summary & Prototype Scope")

    features = [
        ("Pantry & Refrigerator Tracking", "Centralizes all food items across 6 structured categories. Tracks net stock, individual intake batches, and metric units (kg, liters, units, g).", COLOR_PRIMARY),
        ("Batch-Level Expiration Tracking", "Records distinct purchase and expiration dates for every batch. Automatically calculates nearest expiration date across active stock.", COLOR_DARK_BLUE),
        ("Instant Modal Category Filters", "Interactive category selectors and keyword search inside Stock-In and Stock-Out modals for fast, immediate material location.", COLOR_ACCENT),
        ("Multi-Tier Health Badges", "Real-time visual indicators: Sufficient (Green), Low Stock (Yellow), Expiring Soon (Orange), Expired (Red), and Out of Stock (Red).", COLOR_EMERALD),
        ("3-Day Lookahead Expiration Alert", "Proactively scans active inventory and displays an urgent top alert banner for batches expiring within 3 days or already expired.", COLOR_AMBER),
        ("Automated Reorder Shopping List", "Automatically generates replenishment lists when stock drops below minimum thresholds, with calculated order quantities.", COLOR_ROSE)
    ]

    for idx, (ftitle, fdesc, fcolor) in enumerate(features):
        r = idx // 3
        c = idx % 3
        card = create_card(s2, 0.8 + c * 3.95, 1.4 + r * 2.65, 3.8, 2.45, ftitle, fcolor)
        tb = s2.shapes.add_textbox(Inches(0.95 + c * 3.95), Inches(1.95 + r * 2.65), Inches(3.5), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = fdesc
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN
    add_footer(s2, 2)

    # ==========================================
    # SLIDE 3: 6 FOOD CATEGORIES
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "2. Food Category Architecture & Storage Classification")

    categories = [
        ("1. Fruits", "4°C to 7°C", "Crisper storage; humidity controlled", "Gala Apples, Strawberries, Lemons, Bananas", COLOR_ROSE),
        ("2. Vegetables", "2°C to 4°C", "Chilling-sensitive moisture preservation", "Baby Spinach, Carrots, Yellow Onions, Garlic", COLOR_EMERALD),
        ("3. Dairy Products", "1°C to 3°C", "Strict cold-chain refrigeration", "Whole Milk, Cheddar Cheese, Butter, Heavy Cream", COLOR_PRIMARY),
        ("4. Baking Products", "15°C to 20°C", "Dry pantry storage; sealed bins", "Flour, Granulated Sugar, Active Dry Yeast", COLOR_AMBER),
        ("5. Dessert Products", "-18°C to 4°C", "Freezer & chilled dessert bases", "Dark Chocolate Chips, Tart Pastry Shells", RGBColor(168, 85, 247)),
        ("6. Raw Materials & Other", "Ambient / Chilled", "Cooking staples, oils, seasonings, proteins", "Chicken Breast, Olive Oil, Black Pepper, Soy Sauce", RGBColor(100, 116, 139))
    ]

    for idx, (cname, temp, prof, ex, color) in enumerate(categories):
        r = idx // 3
        c = idx % 3
        card = create_card(s3, 0.8 + c * 3.95, 1.4 + r * 2.65, 3.8, 2.45, cname, color)
        tb = s3.shapes.add_textbox(Inches(0.9 + c * 3.95), Inches(1.9 + r * 2.65), Inches(3.6), Inches(1.85))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"• Recommended Temp: {temp}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_MAIN
        
        p2 = tf.add_paragraph()
        p2.text = f"• Storage Profile: {prof}"
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = f"• Items: {ex}"
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = COLOR_PRIMARY
        p3.space_before = Pt(4)
    add_footer(s3, 3)

    # ==========================================
    # SLIDE 4: SYSTEM ARCHITECTURE & TECH STACK
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "3. Full-Stack System Architecture & Technology Stack")

    tiers = [
        ("Frontend Client Layer", "React 18 + Vite (Port 5173)", [
            ("Glassmorphic Dashboard", "Real-time KPI metric counters and top alert banner."),
            ("Category Grid & Table", "Searchable catalog with 6 food category tabs & health filters."),
            ("Interactive Modals", "Dedicated Stock-In, Stock-Out, New Item, and Shopping List modals.")
        ], COLOR_PRIMARY),
        ("REST API Backend Layer", "Node.js + Express (Port 5000)", [
            ("CRUD Operations", "Endpoints for category, item, and batch transaction management."),
            ("Health Computation", "Real-time status calculation (Sufficient, Low Stock, Expiring)."),
            ("Telemetry Service", "3-day expiration evaluation and shopping list deficit aggregation.")
        ], COLOR_DARK_BLUE),
        ("Data Persistence Layer", "SQLite Database (pantry.db)", [
            ("ACID Reliability", "Atomically records all inflows and outflows with foreign key cascades."),
            ("Normalized Tables", "3NF relational schema: categories, items, inventory_transactions."),
            ("B-Tree Indexes", "Optimized lookups on category_id and expiration_date.")
        ], COLOR_EMERALD)
    ]

    for idx, (tname, tsub, titems, tcolor) in enumerate(tiers):
        create_card(s4, 0.8 + idx * 3.95, 1.4, 3.8, 5.35, tname, tcolor)
        tb = s4.shapes.add_textbox(Inches(0.95 + idx * 3.95), Inches(1.95), Inches(3.5), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p_sub = tf.paragraphs[0]
        p_sub.text = tsub.upper()
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_TEXT_MUTED

        for iname, idesc in titems:
            pi = tf.add_paragraph()
            pi.text = f"▶ {iname}"
            pi.font.size = Pt(11)
            pi.font.bold = True
            pi.font.color.rgb = COLOR_NAVY
            pi.space_before = Pt(12)

            pid = tf.add_paragraph()
            pid.text = idesc
            pid.font.size = Pt(10)
            pid.font.color.rgb = COLOR_TEXT_MAIN
            pid.space_before = Pt(2)
    add_footer(s4, 4)

    # ==========================================
    # SLIDE 5: RELATIONAL DATA SCHEMA & TABLES
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "4. Relational Database Schema & Entity Relationships")

    create_card(s5, 0.8, 1.4, 5.7, 5.35, "Relational SQLite DDL Schema", COLOR_NAVY)
    tb_ddl = s5.shapes.add_textbox(Inches(0.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_ddl = tb_ddl.text_frame
    tf_ddl.word_wrap = True
    p_ddl = tf_ddl.paragraphs[0]
    p_ddl.text = """-- 1. Categories Table (1:N with Items)
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- 2. Items Table (1:N with Transactions)
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  unit TEXT NOT NULL, -- kg, liters, g, units
  min_threshold REAL NOT NULL DEFAULT 1.0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory Transactions (Batch Inflow / Outflow)
CREATE TABLE inventory_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL REFERENCES items(id),
  transaction_type TEXT CHECK(transaction_type IN ('IN','OUT')),
  quantity REAL NOT NULL,
  purchase_date TEXT,
  expiration_date TEXT,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  reason TEXT
);"""
    p_ddl.font.size = Pt(9)
    p_ddl.font.name = "Courier New"
    p_ddl.font.color.rgb = COLOR_NAVY

    create_card(s5, 6.8, 1.4, 5.7, 5.35, "Data Integrity & Calculation Rules", COLOR_PRIMARY)
    tb_rules = s5.shapes.add_textbox(Inches(6.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_r = tb_rules.text_frame
    tf_r.word_wrap = True
    schema_rules = [
        ("Current Stock Aggregation", "current_stock = SUM(CASE WHEN type='IN' THEN qty ELSE -qty END) calculated in real time per item."),
        ("Nearest Expiration Lookup", "MIN(expiration_date) across positive active batches gives the nearest expiry badge."),
        ("Foreign Key Cascades", "Deleting an item cleans up all associated transaction records safely."),
        ("B-Tree Indexes", "idx_items_category and idx_transactions_exp ensure sub-5ms query response times.")
    ]
    for idx, (rname, rdesc) in enumerate(schema_rules):
        p = tf_r.paragraphs[0] if idx == 0 else tf_r.add_paragraph()
        p.text = f"✔ {rname}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.space_before = Pt(8) if idx > 0 else Pt(0)
        
        pd = tf_r.add_paragraph()
        pd.text = rdesc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = COLOR_TEXT_MAIN
        pd.space_before = Pt(2)
    add_footer(s5, 5)

    # ==========================================
    # SLIDE 6: OBJECT-ORIENTED DOMAIN ENTITIES
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "5. Object-Oriented Domain Entities & UML Structure")

    classes = [
        ("Category", "Domain Grouping", [
            ("+ id: int [PK]", "+ name: string", "+ description: string"),
            ("+ getItems(): List<InventoryItem>")
        ]),
        ("InventoryItem", "Core Catalog Entity", [
            ("+ id: int [PK]", "+ categoryId: int [FK]", "+ name: string", "+ unit: string", "+ minThreshold: float"),
            ("+ calculateCurrentStock(): float", "+ getNearestExpiration(): Date", "+ evaluateStatus(): StatusBadge")
        ]),
        ("InventoryTransaction", "Batch Movement Record", [
            ("+ id: int [PK]", "+ itemId: int [FK]", "+ transactionType: 'IN'|'OUT'", "+ quantity: float"),
            ("+ purchaseDate: Date", "+ expirationDate: Date", "+ reason: string")
        ]),
        ("AlertEngine", "Telemetry Service", [
            ("+ evaluateExpiringLots(horizonDays=3): List<Alert>", "+ evaluateLowStock(): List<ShoppingListItem>")
        ]),
        ("StockInPayload", "Inbound DTO", [
            ("+ itemId: int", "+ quantity: float", "+ purchaseDate: Date", "+ expirationDate: Date", "+ reason: string")
        ]),
        ("StockOutPayload", "Outbound DTO", [
            ("+ itemId: int", "+ quantity: float", "+ reason: 'Used/Consumed'|'Spoiled/Expired'|'Transferred'")
        ])
    ]

    for idx, (cname, ctype, mems) in enumerate(classes):
        r = idx // 3
        c = idx % 3
        create_card(s6, 0.8 + c * 3.95, 1.4 + r * 2.65, 3.8, 2.45, f"{cname} | {ctype}", COLOR_NAVY)
        tb = s6.shapes.add_textbox(Inches(0.9 + c * 3.95), Inches(1.9 + r * 2.65), Inches(3.6), Inches(1.85))
        tf = tb.text_frame
        tf.word_wrap = True
        
        for p_idx, mem in enumerate(mems):
            p = tf.paragraphs[0] if p_idx == 0 else tf.add_paragraph()
            p.text = mem if isinstance(mem, str) else "\n".join(mem)
            p.font.size = Pt(9.5)
            p.font.color.rgb = COLOR_TEXT_MAIN
            p.space_before = Pt(4) if p_idx > 0 else Pt(0)
    add_footer(s6, 6)

    # ==========================================
    # SLIDE 7: CRC CARDS SUITE
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "6. Class-Responsibility-Collaborator (CRC) Cards")

    crc_cards = [
        ("InventoryItem", 
         ["• Maintains item name, category, unit, and min threshold", "• Aggregates total stock balance from transactions", "• Evaluates health status (Sufficient, Low, Expiring)"],
         ["• Category", "• InventoryTransaction", "• AlertEngine"], COLOR_PRIMARY),
        ("InventoryTransaction", 
         ["• Records individual batch inflow and consumption outflow", "• Tracks specific purchase and expiration dates", "• Logs reason classification"],
         ["• InventoryItem"], COLOR_DARK_BLUE),
        ("AlertEngine", 
         ["• Scans batch expiration dates against today's date", "• Emits 3-day lookahead Expiring Soon alerts", "• Compiles Low Stock items into Shopping List"],
         ["• InventoryItem", "• InventoryTransaction"], COLOR_EMERALD)
    ]

    for idx, (cname, resps, collabs, color) in enumerate(crc_cards):
        create_card(s7, 0.8 + idx * 3.95, 1.4, 3.8, 5.35, cname, color)
        tb = s7.shapes.add_textbox(Inches(0.95 + idx * 3.95), Inches(1.95), Inches(3.5), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = "RESPONSIBILITIES (What it Does):"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        for r in resps:
            pr = tf.add_paragraph()
            pr.text = r
            pr.font.size = Pt(9.5)
            pr.font.color.rgb = COLOR_TEXT_MAIN
            pr.space_before = Pt(3)

        p2 = tf.add_paragraph()
        p2.text = "COLLABORATORS (Interacts With):"
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_PRIMARY
        p2.space_before = Pt(14)

        for c in collabs:
            pc = tf.add_paragraph()
            pc.text = c
            pc.font.size = Pt(9.5)
            pc.font.color.rgb = COLOR_TEXT_MAIN
            pc.space_before = Pt(3)
    add_footer(s7, 7)

    # ==========================================
    # SLIDE 8: INBOUND STOCK-IN WORKFLOW
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "7. Inbound Stock-In Workflow & Category Filter Feature")

    steps_in = [
        ("Step 1: Open Stock-In Modal", "User clicks '+ In' on an inventory row or '+ Stock In' from the dashboard."),
        ("Step 2: Instant Category & Keyword Filter", "User selects a Category (e.g., 'Dairy Products') or types in the live search box. Modal dynamically filters dropdown to only matching materials."),
        ("Step 3: Quantity & Batch Dates Entry", "User specifies intake quantity, purchase date, and batch expiration date."),
        ("Step 4: Reason Tagging", "User selects reason: 'Initial Stock / Regular Purchase', 'Supplier Restock', or 'Fresh Produce Restock'."),
        ("Step 5: Database Commit & Real-Time Sync", "POST /api/transactions/in logs the transaction, updates stock totals, and refreshes the UI dashboard instantly.")
    ]

    for idx, (stitle, sdesc) in enumerate(steps_in):
        sbox = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4 + idx * 1.05), Inches(11.3), Inches(0.95))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = COLOR_WHITE
        sbox.line.color.rgb = COLOR_PRIMARY
        sbox.line.width = Pt(1.5)

        num_badge = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.15), Inches(1.52 + idx * 1.05), Inches(0.7), Inches(0.7))
        num_badge.fill.solid()
        num_badge.fill.fore_color.rgb = COLOR_PRIMARY
        num_badge.line.fill.background()
        tf_nb = num_badge.text_frame
        p_nb = tf_nb.paragraphs[0]
        p_nb.text = f"{idx+1}"
        p_nb.font.size = Pt(18)
        p_nb.font.bold = True
        p_nb.font.color.rgb = COLOR_WHITE
        p_nb.alignment = PP_ALIGN.CENTER

        tb_step = s8.shapes.add_textbox(Inches(2.0), Inches(1.45 + idx * 1.05), Inches(10.1), Inches(0.85))
        tf_s = tb_step.text_frame
        tf_s.word_wrap = True
        p_st = tf_s.paragraphs[0]
        p_st.text = stitle
        p_st.font.size = Pt(11)
        p_st.font.bold = True
        p_st.font.color.rgb = COLOR_PRIMARY
        
        p_sd = tf_s.add_paragraph()
        p_sd.text = sdesc
        p_sd.font.size = Pt(9.5)
        p_sd.font.color.rgb = COLOR_TEXT_MAIN
        p_sd.space_before = Pt(2)
    add_footer(s8, 8)

    # ==========================================
    # SLIDE 9: OUTBOUND STOCK-OUT WORKFLOW
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "8. Outbound Stock-Out Workflow & Validation Rules")

    create_card(s9, 0.8, 1.4, 5.7, 5.35, "Stock-Out Execution Flow", COLOR_ROSE)
    tb_so = s9.shapes.add_textbox(Inches(0.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_so = tb_so.text_frame
    tf_so.word_wrap = True
    so_steps = [
        ("1. Material Selection", "User filters by category or searches item name inside the Stock-Out modal."),
        ("2. Stock Sufficiency Check", "Modal validates that deduction quantity <= available stock balance. Over-deductions are blocked with an error banner."),
        ("3. Reason Classification", "User selects one of 3 clean reasons: 'Used / Consumed', 'Spoiled / Expired', or 'Transferred'."),
        ("4. Atomic Deduction Commit", "POST /api/transactions/out writes the 'OUT' transaction and updates the item's balance.")
    ]
    for idx, (sname, sdesc) in enumerate(so_steps):
        p = tf_so.paragraphs[0] if idx == 0 else tf_so.add_paragraph()
        p.text = sname
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_ROSE
        p.space_before = Pt(8) if idx > 0 else Pt(0)
        
        pd = tf_so.add_paragraph()
        pd.text = sdesc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = COLOR_TEXT_MAIN
        pd.space_before = Pt(2)

    create_card(s9, 6.8, 1.4, 5.7, 5.35, "Deduction Reason Definitions", COLOR_DARK_BLUE)
    tb_reasons = s9.shapes.add_textbox(Inches(6.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_rea = tb_reasons.text_frame
    tf_rea.word_wrap = True
    reasons = [
        ("Used / Consumed (Default)", "Standard culinary usage: ingredients cooked, eaten, or prepared for meals."),
        ("Spoiled / Expired", "Discarded inventory: food that reached past expiration, spoiled, or went bad."),
        ("Transferred", "Relocated inventory: stock transferred to another kitchen, station, or storage area.")
    ]
    for idx, (rname, rdesc) in enumerate(reasons):
        p = tf_rea.paragraphs[0] if idx == 0 else tf_rea.add_paragraph()
        p.text = f"• {rname}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_DARK_BLUE
        p.space_before = Pt(12) if idx > 0 else Pt(0)
        
        pd = tf_rea.add_paragraph()
        pd.text = rdesc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = COLOR_TEXT_MAIN
        pd.space_before = Pt(2)
    add_footer(s9, 9)

    # ==========================================
    # SLIDE 10: REAL-TIME HEALTH STATUS BADGES
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "9. Real-Time Telemetry & 5 Status Badges")

    badges = [
        ("SUFFICIENT (Green Badge)", "Trigger: current_stock >= min_threshold & No Expiring Batches", "Healthy stock level; no immediate action required.", COLOR_EMERALD),
        ("LOW_STOCK (Yellow Badge)", "Trigger: 0 < current_stock < min_threshold", "Inventory running low; automatically added to Reorder Shopping List.", RGBColor(234, 179, 8)),
        ("EXPIRING_SOON (Orange Badge)", "Trigger: 0 < (expiration_date - TODAY) <= 3 Days", "Batch near expiration; highlighted in top banner to prioritize usage.", COLOR_AMBER),
        ("EXPIRED (Red Badge)", "Trigger: Positive batch with expiration_date < TODAY", "Batch past expiration; flagged for immediate inspection or discard.", COLOR_ROSE),
        ("OUT_OF_STOCK (Red Badge)", "Trigger: current_stock <= 0", "Completely depleted; urgent restock required.", COLOR_NAVY)
    ]

    for idx, (bname, btrig, bact, bcol) in enumerate(badges):
        bcard = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4 + idx * 1.05), Inches(11.3), Inches(0.95))
        bcard.fill.solid()
        bcard.fill.fore_color.rgb = COLOR_WHITE
        bcard.line.color.rgb = bcol
        bcard.line.width = Pt(1.5)

        cbadge = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.15), Inches(1.55 + idx * 1.05), Inches(0.35), Inches(0.65))
        cbadge.fill.solid()
        cbadge.fill.fore_color.rgb = bcol
        cbadge.line.fill.background()

        tb_b = s10.shapes.add_textbox(Inches(1.65), Inches(1.45 + idx * 1.05), Inches(10.5), Inches(0.85))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True

        p_bt = tf_b.paragraphs[0]
        p_bt.text = bname
        p_bt.font.size = Pt(11)
        p_bt.font.bold = True
        p_bt.font.color.rgb = bcol

        p_bd = tf_b.add_paragraph()
        p_bd.text = f"{btrig}   •   {bact}"
        p_bd.font.size = Pt(9.5)
        p_bd.font.color.rgb = COLOR_TEXT_MAIN
        p_bd.space_before = Pt(2)
    add_footer(s10, 10)

    # ==========================================
    # SLIDE 11: REORDER SHOPPING LIST ENGINE
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "10. Automated Reorder Shopping List Engine")

    create_card(s11, 0.8, 1.4, 5.7, 5.35, "Reorder Calculation Formula", COLOR_PRIMARY)
    tb_calc = s11.shapes.add_textbox(Inches(0.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_calc = tb_calc.text_frame
    tf_calc.word_wrap = True
    
    p_eq = tf_calc.paragraphs[0]
    p_eq.text = "Replenishment Target Formula:"
    p_eq.font.size = Pt(11)
    p_eq.font.bold = True
    p_eq.font.color.rgb = COLOR_NAVY

    peq1 = tf_calc.add_paragraph()
    peq1.text = "Target Stock = 2 × min_threshold\nSuggested Reorder = MAX(1, Target Stock - current_stock)"
    peq1.font.size = Pt(10)
    peq1.font.name = "Courier New"
    peq1.font.color.rgb = COLOR_PRIMARY
    peq1.space_before = Pt(4)

    p_ex = tf_calc.add_paragraph()
    p_ex.text = "\nExample Calculation (Lemons):"
    p_ex.font.size = Pt(11)
    p_ex.font.bold = True
    p_ex.font.color.rgb = COLOR_NAVY
    p_ex.space_before = Pt(8)

    pex1 = tf_calc.add_paragraph()
    pex1.text = "• Min Threshold: 10.0 units\n• Current Stock: 2.0 units\n• Target Level: 20.0 units\n• Suggested Reorder: 18.0 units (Urgency: HIGH)"
    pex1.font.size = Pt(9.5)
    pex1.font.color.rgb = COLOR_TEXT_MAIN
    pex1.space_before = Pt(2)

    create_card(s11, 6.8, 1.4, 5.7, 5.35, "Shopping List Modal Features", COLOR_DARK_BLUE)
    tb_shop = s11.shapes.add_textbox(Inches(6.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_shop = tb_shop.text_frame
    tf_shop.word_wrap = True
    shop_features = [
        ("Automated Compilation", "GET /api/alerts/shopping-list dynamically gathers all depleted items below threshold."),
        ("One-Click Access", "Top header button displays a live red badge count with total deficit items."),
        ("Urgency Badges", "Tags depleted stock (<= 0) as 'CRITICAL' and low stock as 'HIGH'."),
        ("Category Breakdown", "Organizes items by category with exact units for easy in-store or online grocery purchasing.")
    ]
    for idx, (sftitle, sfdesc) in enumerate(shop_features):
        p = tf_shop.paragraphs[0] if idx == 0 else tf_shop.add_paragraph()
        p.text = f"✔ {sftitle}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_DARK_BLUE
        p.space_before = Pt(8) if idx > 0 else Pt(0)
        
        pd = tf_shop.add_paragraph()
        pd.text = sfdesc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = COLOR_TEXT_MAIN
        pd.space_before = Pt(2)
    add_footer(s11, 11)

    # ==========================================
    # SLIDE 12: CORE MODULES & CODE BREAKDOWN
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "11. Core Modules & Code Implementation Breakdown")

    create_card(s12, 0.8, 1.4, 5.7, 5.35, "Backend Modules (Node / Express / SQLite)", COLOR_PRIMARY)
    tb_m = s12.shapes.add_textbox(Inches(0.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_m = tb_m.text_frame
    tf_m.word_wrap = True
    be_modules = [
        ("server.js", "Express REST server hosting /api/categories, /api/items, /api/transactions/in, /api/transactions/out, /api/dashboard/summary, and /api/alerts/*."),
        ("db.js", "SQLite database connection manager with async run(), get(), all() helper wrappers and auto-initialization."),
        ("schema.sql & seed.sql", "DDL script defining categories, items, and inventory_transactions with realistic sample items.")
    ]
    for idx, (mtitle, mdesc) in enumerate(be_modules):
        p = tf_m.paragraphs[0] if idx == 0 else tf_m.add_paragraph()
        p.text = f"• {mtitle}"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.space_before = Pt(6) if idx > 0 else Pt(0)
        
        pd = tf_m.add_paragraph()
        pd.text = mdesc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = COLOR_TEXT_MAIN
        pd.space_before = Pt(2)

    create_card(s12, 6.8, 1.4, 5.7, 5.35, "Frontend Modules (React 18 + Vite)", COLOR_DARK_BLUE)
    tb_fe = s12.shapes.add_textbox(Inches(6.95), Inches(1.95), Inches(5.4), Inches(4.6))
    tf_fe = tb_fe.text_frame
    tf_fe.word_wrap = True
    fe_modules = [
        ("App.jsx", "Root orchestrator managing data fetch, search/category state, alert banners, and modal visibility."),
        ("StockInModal.jsx / StockOutModal.jsx", "Enhanced modals featuring live category dropdown filtering and instant material search."),
        ("InventoryTable.jsx & CategoryGrid.jsx", "Renderable interactive tables and cards with color-coded status badges."),
        ("ShoppingListModal.jsx", "Reorder modal displaying all low-stock items with suggested replenishment quantities.")
    ]
    for idx, (vtitle, vdesc) in enumerate(fe_modules):
        p = tf_fe.paragraphs[0] if idx == 0 else tf_fe.add_paragraph()
        p.text = f"• {vtitle}"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_DARK_BLUE
        p.space_before = Pt(6) if idx > 0 else Pt(0)
        
        pd = tf_fe.add_paragraph()
        pd.text = vdesc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = COLOR_TEXT_MAIN
        pd.space_before = Pt(2)
    add_footer(s12, 12)

    # ==========================================
    # SLIDE 13: SIMPLIFIED PROTOTYPE SUMMARY & LIVE URL
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "12. Summary & Live Prototype Deployment")

    # 4 clean summary cards in a 2x2 grid (adjusted height to accommodate live link banner)
    summary_cards = [
        ("1. Accurate Stock Tracking", "Maintains exact real-time quantities and batch expiration dates across all 6 food groups with zero data loss.", COLOR_PRIMARY),
        ("2. Instant Material Discovery", "Category filter dropdowns and keyword search in Stock-In/Out modals allow users to find items in seconds.", COLOR_EMERALD),
        ("3. Proactive Spoilage Prevention", "3-day lookahead expiration warnings and nearest expiry tags ensure perishable ingredients are used before spoiling.", COLOR_AMBER),
        ("4. Automated Reordering", "Calculates required restock amounts automatically when stock falls below threshold, simplifying grocery planning.", COLOR_DARK_BLUE)
    ]

    for idx, (stitle, sdesc, scolor) in enumerate(summary_cards):
        r = idx // 2
        c = idx % 2
        card = create_card(s13, 1.0 + c * 5.8, 1.38 + r * 2.2, 5.5, 2.05, stitle, scolor)
        tb = s13.shapes.add_textbox(Inches(1.2 + c * 5.8), Inches(1.92 + r * 2.2), Inches(5.1), Inches(1.35))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = sdesc
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.line_spacing = 1.25

    # Live Vercel Deployment Link Banner
    live_banner = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.95), Inches(11.3), Inches(0.95))
    live_banner.fill.solid()
    live_banner.fill.fore_color.rgb = COLOR_NAVY
    live_banner.line.color.rgb = COLOR_EMERALD
    live_banner.line.width = Pt(2)

    tb_live = s13.shapes.add_textbox(Inches(1.2), Inches(6.0), Inches(10.9), Inches(0.85))
    tf_l = tb_live.text_frame
    tf_l.word_wrap = True
    
    p_l1 = tf_l.paragraphs[0]
    p_l1.text = "🌐 LIVE PRODUCTION DEPLOYMENT (VERCEL)"
    p_l1.font.size = Pt(10)
    p_l1.font.bold = True
    p_l1.font.color.rgb = COLOR_ACCENT
    
    p_l2 = tf_l.add_paragraph()
    p_l2.text = "https://refrigerator-inventory-system.vercel.app/"
    p_l2.font.size = Pt(15)
    p_l2.font.bold = True
    p_l2.font.color.rgb = COLOR_EMERALD
    p_l2.space_before = Pt(2)

    add_footer(s13, 13)

    prs.save(OUTPUT_PPTX)
    print(f"Successfully generated clean {TOTAL_SLIDES}-slide presentation at: {OUTPUT_PPTX}")

if __name__ == "__main__":
    create_presentation()
