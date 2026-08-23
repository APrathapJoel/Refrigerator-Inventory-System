import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def generate_uml_diagram(output_path="uml_class_diagram.png"):
    # 16:9 widescreen canvas, high resolution
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC') # Slate 50 background

    # Title Banner
    title_box = patches.FancyBboxPatch((0.5, 8.1), 15, 0.7, boxstyle="round,pad=0.08,rounding_size=0.08",
                                       linewidth=0, facecolor='#0F172A')
    ax.add_patch(title_box)
    ax.text(8.0, 8.45, "REFRIGERATOR INVENTORY SUBSYSTEM (RIMS) - OBJECT-ORIENTED UML CLASS DIAGRAM",
            ha='center', va='center', fontsize=14, fontweight='bold', color='#38BDF8', fontfamily='sans-serif')

    def draw_uml_box(ax, x, y, w, h, class_name, stereotype, attributes, methods, header_color='#1E293B'):
        # Outer Card
        outer = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.08",
                                      linewidth=1.8, edgecolor=header_color, facecolor='#FFFFFF')
        ax.add_patch(outer)

        # Header Compartment
        hdr_h = 0.85
        hdr = patches.FancyBboxPatch((x, y + h - hdr_h), w, hdr_h, boxstyle="round,pad=0.05,rounding_size=0.08",
                                    linewidth=0, facecolor=header_color)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.28, f"«{stereotype}»", ha='center', va='center',
                fontsize=9, fontweight='bold', color='#38BDF8', fontfamily='sans-serif')
        ax.text(x + w/2, y + h - 0.58, class_name, ha='center', va='center',
                fontsize=12, fontweight='bold', color='#FFFFFF', fontfamily='sans-serif')

        # Attributes Compartment
        attr_y = y + h - hdr_h - 0.25
        for attr in attributes:
            ax.text(x + 0.15, attr_y, attr, ha='left', va='center',
                    fontsize=8.5, color='#0F172A', fontfamily='monospace')
            attr_y -= 0.26

        # Compartment Divider
        div_y = attr_y + 0.1
        ax.plot([x + 0.05, x + w - 0.05], [div_y, div_y], color='#CBD5E1', linewidth=1.2)

        # Methods Compartment
        meth_y = div_y - 0.25
        for meth in methods:
            ax.text(x + 0.15, meth_y, meth, ha='left', va='center',
                    fontsize=8.5, color='#1E40AF', fontfamily='monospace')
            meth_y -= 0.26

    # 1. Category Class Box
    draw_uml_class = draw_uml_box
    draw_uml_class(ax, 0.6, 4.4, 4.0, 3.4, "Category", "Entity",
                   ["- id: int [PK]",
                    "- name: string",
                    "- description: string"],
                   ["+ getItems(): List<InventoryItem>",
                    "+ getStorageProfile(): string",
                    "+ getItemCount(): int"],
                   header_color='#1E3A8A')

    # 2. InventoryItem Class Box (Central Aggregate Root)
    draw_uml_class(ax, 5.8, 4.2, 4.4, 3.6, "InventoryItem", "Aggregate Root",
                   ["- id: int [PK]",
                    "- categoryId: int [FK]",
                    "- name: string",
                    "- unit: string",
                    "- minThreshold: float"],
                   ["+ calculateCurrentStock(): float",
                    "+ getNearestExpiration(): Date",
                    "+ evaluateStatus(): StatusBadge",
                    "+ isLowStock(): boolean",
                    "+ getBatchHistory(): List<Tx>"],
                   header_color='#0F172A')

    # 3. InventoryTransaction Class Box
    draw_uml_class(ax, 11.4, 4.2, 4.0, 3.6, "InventoryTransaction", "Entity",
                   ["- id: int [PK]",
                    "- itemId: int [FK]",
                    "- transactionType: 'IN' | 'OUT'",
                    "- quantity: float",
                    "- purchaseDate: Date",
                    "- expirationDate: Date",
                    "- reason: string"],
                   ["+ isExpired(today: Date): bool",
                    "+ isExpiringSoon(days=3): bool",
                    "+ getRemainingDays(): int"],
                   header_color='#0369A1')

    # 4. AlertEngine Class Box
    draw_uml_class(ax, 0.6, 0.6, 4.6, 3.4, "AlertEngine", "Domain Service",
                   ["- alertHorizonDays: int = 3",
                    "- replenishmentMultiplier: float = 2.0",
                    "- activeAlerts: List<BatchAlert>"],
                   ["+ evaluateExpiringLots(): List<Alert>",
                    "+ evaluateLowStock(): List<Item>",
                    "+ calculateReorderQuantity(): float",
                    "+ generateShoppingList(): List<DTO>"],
                   header_color='#047857')

    # 5. Transaction DTOs Box
    draw_uml_class(ax, 5.8, 0.6, 9.6, 3.2, "TransactionPayloads (DTOs)", "Data Contracts",
                   ["+ StockInDTO: { itemId: int, quantity: float, purchaseDate: Date, expirationDate: Date, reason: string }",
                    "+ StockOutDTO: { itemId: int, quantity: float, reason: 'Used/Consumed' | 'Spoiled/Expired' | 'Transferred' }",
                    "+ ShoppingListItemDTO: { itemId: int, name: string, currentStock: float, suggestedReorder: float, urgency: string }"],
                   ["+ validateInbound(payload: StockInDTO): ValidationResult",
                    "+ validateOutbound(payload: StockOutDTO, currentStock: float): ValidationResult"],
                   header_color='#475569')

    # --- Relationships & Connectors ---
    # Category 1 ─── 0..* InventoryItem
    ax.annotate('', xy=(5.78, 6.0), xytext=(4.62, 6.0),
                arrowprops=dict(arrowstyle='-|>', color='#0284C7', lw=2.2, mutation_scale=16))
    ax.plot([4.6, 4.6], [6.0, 6.0], color='#0284C7')
    ax.text(4.75, 6.15, "1", fontsize=10, fontweight='bold', color='#0F172A')
    ax.text(5.45, 6.15, "0..*", fontsize=10, fontweight='bold', color='#0F172A')
    ax.text(5.15, 5.75, "contains", fontsize=8.5, fontstyle='italic', ha='center', color='#0284C7')

    # InventoryItem 1 ─── 0..* InventoryTransaction
    ax.annotate('', xy=(11.38, 6.0), xytext=(10.22, 6.0),
                arrowprops=dict(arrowstyle='-|>', color='#0284C7', lw=2.2, mutation_scale=16))
    ax.text(10.35, 6.15, "1", fontsize=10, fontweight='bold', color='#0F172A')
    ax.text(11.05, 6.15, "0..*", fontsize=10, fontweight='bold', color='#0F172A')
    ax.text(10.75, 5.75, "records", fontsize=8.5, fontstyle='italic', ha='center', color='#0284C7')

    # AlertEngine ..> InventoryItem (Dependency arrow)
    ax.annotate('', xy=(6.5, 4.18), xytext=(3.5, 4.02),
                arrowprops=dict(arrowstyle='->', color='#059669', lw=1.8, linestyle='dashed', mutation_scale=15))
    ax.text(4.8, 3.9, "«monitors & evaluates»", fontsize=8.5, fontweight='bold', color='#059669', ha='center')

    # Footer note
    ax.text(8.0, 0.18, "UML 2.5 Standard Notation   •   Solid Lines: Associations / Aggregations   •   Dashed Lines: Service Dependencies",
            ha='center', va='center', fontsize=9, color='#64748B', fontfamily='sans-serif')

    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print(f"Generated UML Class Diagram at: {output_path}")

def generate_crc_diagram(output_path="crc_cards_diagram.png"):
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    # Title Banner
    title_box = patches.FancyBboxPatch((0.5, 8.1), 15, 0.7, boxstyle="round,pad=0.08,rounding_size=0.08",
                                       linewidth=0, facecolor='#0F172A')
    ax.add_patch(title_box)
    ax.text(8.0, 8.45, "CLASS-RESPONSIBILITY-COLLABORATOR (CRC) CARDS SUITE",
            ha='center', va='center', fontsize=14, fontweight='bold', color='#38BDF8', fontfamily='sans-serif')

    def draw_crc(ax, x, y, w, h, class_name, stereotype, responsibilities, collaborators, header_color='#0F172A'):
        # Outer index card
        outer = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.08",
                                      linewidth=1.8, edgecolor=header_color, facecolor='#FFFFFF')
        ax.add_patch(outer)

        # Header Bar
        hdr_h = 0.7
        hdr = patches.FancyBboxPatch((x, y + h - hdr_h), w, hdr_h, boxstyle="round,pad=0.05,rounding_size=0.08",
                                    linewidth=0, facecolor=header_color)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.35, f"CLASS: {class_name.upper()}   «{stereotype}»",
                ha='center', va='center', fontsize=11, fontweight='bold', color='#FFFFFF', fontfamily='sans-serif')

        # Vertical Divider (60% Responsibilities / 40% Collaborators)
        split_x = x + w * 0.62
        ax.plot([split_x, split_x], [y + 0.15, y + h - hdr_h - 0.1], color='#CBD5E1', linewidth=1.5)

        # Left: Responsibilities
        ax.text(x + 0.2, y + h - hdr_h - 0.35, "RESPONSIBILITIES (What it Knows & Does):",
                fontsize=9.5, fontweight='bold', color=header_color, fontfamily='sans-serif')
        
        ry = y + h - hdr_h - 0.72
        for resp in responsibilities:
            ax.text(x + 0.2, ry, f"• {resp}", fontsize=9, color='#1E293B', fontfamily='sans-serif')
            ry -= 0.38

        # Right: Collaborators
        ax.text(split_x + 0.2, y + h - hdr_h - 0.35, "COLLABORATORS:",
                fontsize=9.5, fontweight='bold', color='#0F172A', fontfamily='sans-serif')
        
        cy = y + h - hdr_h - 0.72
        for col in collaborators:
            ax.text(split_x + 0.2, cy, f"• {col}", fontsize=9, color='#1E293B', fontfamily='sans-serif')
            cy -= 0.38

    # Card 1: InventoryItem
    draw_crc(ax, 0.6, 5.5, 14.8, 2.4, "InventoryItem", "Aggregate Root",
             ["Maintains ingredient master identity, category FK, unit, and minimum threshold.",
              "Calculates real-time aggregate stock balance by summing transaction history (IN - OUT).",
              "Determines nearest expiration date across active positive batches.",
              "Evaluates dynamic health status badge (Sufficient, Low Stock, Expired, Out of Stock)."],
             ["Category", "InventoryTransaction", "AlertEngine"],
             header_color='#0F172A')

    # Card 2: InventoryTransaction
    draw_crc(ax, 0.6, 2.9, 14.8, 2.4, "InventoryTransaction", "Entity",
             ["Records atomic batch intake ('IN') with specific purchase date and expiration date.",
              "Logs consumption/deduction ('OUT') with designated reason classification.",
              "Enforces First-Expired, First-Out (FEFO) prioritization rules during stock deductions.",
              "Preserves an immutable chronological audit trail of all physical kitchen movements."],
             ["InventoryItem"],
             header_color='#0284C7')

    # Card 3: AlertEngine
    draw_crc(ax, 0.6, 0.3, 14.8, 2.4, "AlertEngine", "Domain Service",
             ["Continuously evaluates batch expiration horizons across 3-day lookahead window.",
              "Emits prioritized expiration alerts for the top dashboard notification banner.",
              "Scans inventory items for deficits below minimum threshold.",
              "Auto-generates Reorder Shopping List with replenishment quantities and urgency tags."],
             ["InventoryItem", "InventoryTransaction"],
             header_color='#047857')

    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print(f"Generated CRC Cards Diagram at: {output_path}")

if __name__ == "__main__":
    generate_uml_diagram()
    generate_crc_diagram()
