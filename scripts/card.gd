extends Control

# MTG Arena Card Node - handles visuals, interactions, and drag/drop functionality
# Styled to match MTG Arena cards with proper MTG mechanics

signal card_clicked(card: Node)
signal card_double_clicked(card: Node)
signal card_right_clicked(card: Node)
signal drag_started(card: Node)
signal drag_ended(card: Node, drop_position: Vector2)

@export var card_id: String = ""
@export var front_texture: Texture2D
@export var back_texture: Texture2D
@export var is_face_up: bool = true
@export var is_draggable: bool = true
@export var hover_scale: float = 1.1
@export var animation_duration: float = 0.3

# MTG card properties
var is_tapped: bool = false
var is_summoning_sick: bool = false
var counters: Dictionary = {}

# Visual components
@onready var card_sprite: TextureRect = $CardSprite
@onready var card_frame: NinePatchRect = $CardFrame
@onready var name_label: Label = $InfoContainer/NameLabel
@onready var cost_label: Label = $InfoContainer/CostLabel
@onready var type_label: Label = $InfoContainer/TypeLabel
@onready var stats_label: Label = $InfoContainer/StatsLabel
@onready var info_container: VBoxContainer = $InfoContainer
@onready var highlight: ColorRect = $Highlight

# Drag and drop state
var is_dragging: bool = false
var drag_offset: Vector2
var original_position: Vector2
var original_parent: Node
var is_hovered: bool = false
var is_selected: bool = false

# Card data cache
var card_data: Dictionary = {}

# MTG Arena styling
var arena_card_colors = {
	"White": Color(1.0, 0.95, 0.8),
	"Blue": Color(0.6, 0.8, 1.0),
	"Black": Color(0.4, 0.4, 0.5),
	"Red": Color(1.0, 0.7, 0.6),
	"Green": Color(0.7, 0.9, 0.6),
	"Colorless": Color(0.8, 0.8, 0.8),
	"Multicolor": Color(0.9, 0.8, 0.5)
}

func _ready():
	# Set MTG Arena card dimensions
	custom_minimum_size = Vector2(120, 168)  # Standard MTG proportions
	
	# Connect input events
	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)
	gui_input.connect(_on_gui_input)
	
	# Initialize card display
	if not card_id.is_empty():
		load_card_data()
		update_mtg_display()
	
	# Set up MTG Arena highlight
	highlight.color = Color(0.2, 0.8, 1.0, 0.0)  # Arena blue
	highlight.mouse_filter = Control.MOUSE_FILTER_IGNORE
	
	# Apply MTG Arena card styling
	_setup_arena_styling()

func _setup_arena_styling():
	"""Apply MTG Arena-specific visual styling"""
	# Set card frame style similar to MTG Arena
	if card_frame:
		card_frame.modulate = Color(0.9, 0.9, 0.9, 1.0)
	
	# Style labels to match Arena
	for label in [name_label, cost_label, type_label, stats_label]:
		if label:
			label.add_theme_color_override("font_color", Color.WHITE)
			label.add_theme_color_override("font_shadow_color", Color.BLACK)
			label.add_theme_constant_override("shadow_offset_x", 1)
			label.add_theme_constant_override("shadow_offset_y", 1)

func load_card_data():
	"""Load card data from GameState singleton"""
	card_data = GameState.get_card_data(card_id)
	if card_data.is_empty():
		print("Warning: No card data found for " + card_id)
		# Create dummy data for testing
		card_data = {
			"name": "Demo Card",
			"mana_cost": 3,
			"type": "Creature",
			"power": 2,
			"toughness": 3
		}

func update_mtg_display():
	"""Update the visual appearance with MTG Arena styling"""
	if card_data.is_empty():
		return
	
	# Update text labels with MTG formatting
	if name_label:
		name_label.text = card_data.get("name", "Unknown")
	if cost_label:
		var mana_cost = card_data.get("mana_cost", 0)
		cost_label.text = "{" + str(mana_cost) + "}"  # MTG mana symbol format
	if type_label:
		type_label.text = card_data.get("type", "Unknown")
	if stats_label:
		var power = card_data.get("power", 0)
		var toughness = card_data.get("toughness", 0)
		if card_data.get("type", "").contains("Creature"):
			stats_label.text = str(power) + "/" + str(toughness)
		else:
			stats_label.text = ""
	
	# Apply card color styling
	_apply_color_styling()
	
	# Update card texture
	if card_sprite:
		var texture = front_texture if is_face_up else back_texture
		card_sprite.texture = texture
		
	# Show/hide info based on face up state
	if info_container:
		info_container.visible = is_face_up
	
	# Handle tapped state visual
	rotation = 90 if is_tapped else 0

func _apply_color_styling():
	"""Apply MTG color-based styling like Arena"""
	var card_type = card_data.get("type", "")
	var color = "Colorless"
	
	# Determine card color from type (simplified)
	if "White" in card_type or "Plains" in card_type:
		color = "White"
	elif "Blue" in card_type or "Island" in card_type:
		color = "Blue"
	elif "Black" in card_type or "Swamp" in card_type:
		color = "Black"
	elif "Red" in card_type or "Mountain" in card_type:
		color = "Red"
	elif "Green" in card_type or "Forest" in card_type:
		color = "Green"
	
	if card_frame and arena_card_colors.has(color):
		card_frame.modulate = arena_card_colors[color]

func _on_gui_input(event: InputEvent):
	"""Handle MTG Arena-style input events"""
	if event is InputEventMouseButton:
		var mouse_event = event as InputEventMouseButton
		
		if mouse_event.button_index == MOUSE_BUTTON_LEFT:
			if mouse_event.pressed:
				if mouse_event.double_click:
					_handle_double_click()
				else:
					_handle_single_click()
					if is_draggable:
						_start_drag(mouse_event.position)
			else:
				if is_dragging:
					_end_drag()
		
		elif mouse_event.button_index == MOUSE_BUTTON_RIGHT and mouse_event.pressed:
			_handle_right_click()
	
	# Handle middle click for tapping (MTG mechanic)
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_MIDDLE and event.pressed:
		toggle_tap()

func _handle_single_click():
	"""Handle single click with MTG Arena selection"""
	card_clicked.emit(self)

func _handle_double_click():
	"""Handle double click - auto-play like Arena"""
	card_double_clicked.emit(self)

func _handle_right_click():
	"""Handle right click - MTG Arena context menu"""
	card_right_clicked.emit(self)
	_show_mtg_context_menu()

func _start_drag(mouse_pos: Vector2):
	"""Initialize MTG Arena-style dragging"""
	if not is_draggable:
		return
		
	is_dragging = true
	drag_offset = mouse_pos
	original_position = global_position
	original_parent = get_parent()
	
	# Arena-style drag elevation
	z_index = 100
	scale = Vector2(1.05, 1.05)  # Slightly larger while dragging
	modulate = Color(1.0, 1.0, 1.0, 0.85)  # Semi-transparent
	
	drag_started.emit(self)

func _end_drag():
	"""End dragging with Arena-style drop detection"""
	if not is_dragging:
		return
		
	is_dragging = false
	var drop_position = get_global_mouse_position()
	
	# Reset visual state
	scale = Vector2.ONE
	modulate = Color.WHITE
	z_index = 0
	
	drag_ended.emit(self, drop_position)

func _process(_delta):
	"""Handle continuous dragging updates"""
	if is_dragging:
		global_position = get_global_mouse_position() - drag_offset

func _on_mouse_entered():
	"""Handle mouse hover start - Arena style"""
	if not is_dragging:
		is_hovered = true
		_animate_arena_hover(true)

func _on_mouse_exited():
	"""Handle mouse hover end"""
	if not is_dragging:
		is_hovered = false
		_animate_arena_hover(false)

func _animate_arena_hover(hover: bool):
	"""Animate hover effect matching MTG Arena"""
	var tween = create_tween()
	tween.parallel()
	
	# Scale effect like Arena
	var target_scale = Vector2(hover_scale, hover_scale) if hover else Vector2.ONE
	tween.tween_property(self, "scale", target_scale, animation_duration)
	
	# Highlight effect
	var highlight_alpha = 0.3 if hover else 0.0
	tween.tween_property(highlight, "color:a", highlight_alpha, animation_duration)
	
	# Subtle glow
	var glow_color = Color(0.2, 0.8, 1.0, highlight_alpha)
	tween.tween_property(highlight, "color", glow_color, animation_duration)

func set_selected(selected: bool):
	"""Set card selection state with Arena styling"""
	is_selected = selected
	
	# Arena-style selection glow
	if selected:
		highlight.color = Color(0.2, 0.8, 1.0, 0.5)  # Arena blue glow
		scale = Vector2(1.02, 1.02)
	else:
		highlight.color = Color(0.2, 0.8, 1.0, 0.0)
		scale = Vector2.ONE

func toggle_tap():
	"""Toggle tapped state (MTG mechanic)"""
	is_tapped = not is_tapped
	
	# Animate rotation for tapping
	var tween = create_tween()
	var target_rotation = 90 if is_tapped else 0
	tween.tween_property(self, "rotation_degrees", target_rotation, 0.2)
	
	# Update GameState if card is tapped
	if GameState.has_method("tap_card"):
		if is_tapped:
			GameState.tap_card(card_id)
		else:
			GameState.untap_card(card_id)

func _show_mtg_context_menu():
	"""Show MTG Arena-style context menu"""
	print("MTG Context Menu for: " + card_data.get("name", card_id))
	# TODO: Implement full context menu with:
	# - Tap/Untap
	# - Move to zone options  
	# - View details
	# - Copy to clipboard

func set_card_id(new_id: String):
	"""Set the card ID and reload MTG data"""
	card_id = new_id
	load_card_data()
	update_mtg_display()

func get_card_id() -> String:
	"""Get card ID for GameState integration"""
	return card_id if not card_id.is_empty() else name

# MTG-specific methods
func add_counter(counter_type: String, amount: int = 1):
	"""Add counters to the card (MTG mechanic)"""
	if not counters.has(counter_type):
		counters[counter_type] = 0
	counters[counter_type] += amount
	_update_counter_display()

func remove_counter(counter_type: String, amount: int = 1):
	"""Remove counters from the card"""
	if counters.has(counter_type):
		counters[counter_type] = max(0, counters[counter_type] - amount)
		if counters[counter_type] == 0:
			counters.erase(counter_type)
		_update_counter_display()

func _update_counter_display():
	"""Update visual counter display"""
	# TODO: Add counter visual indicators
	pass
