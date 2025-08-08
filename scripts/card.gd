extends Control

# Card Node - handles visuals, interactions, and drag/drop functionality
# Supports front/back textures, hover effects, elevation tweens, and context menus

signal card_clicked(card: Node)
signal card_double_clicked(card: Node)
signal card_right_clicked(card: Node)
signal drag_started(card: Node)
signal drag_ended(card: Node, target_zone: Node)

@export var card_id: String = ""
@export var front_texture: Texture2D
@export var back_texture: Texture2D
@export var is_face_up: bool = true
@export var is_draggable: bool = true
@export var hover_elevation: float = 10.0
@export var animation_duration: float = 0.2

# Visual components
@onready var card_sprite: TextureRect = $CardSprite
@onready var card_frame: NinePatchRect = $CardFrame
@onready var name_label: Label = $InfoContainer/NameLabel
@onready var cost_label: Label = $InfoContainer/CostLabel
@onready var type_label: Label = $InfoContainer/TypeLabel
@onready var stats_label: Label = $InfoContainer/StatsLabel
@onready var info_container: VBoxContainer = $InfoContainer
@onready var highlight: ColorRect = $Highlight
@onready var tween_manager: Node = $TweenManager

# Drag and drop state
var is_dragging: bool = false
var drag_offset: Vector2
var original_position: Vector2
var original_parent: Node
var is_hovered: bool = false
var is_selected: bool = false

# Card data cache
var card_data: Dictionary = {}

func _ready():
	# Set up visual components
	custom_minimum_size = Vector2(120, 168)  # Standard card proportions
	
	# Connect input events
	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)
	gui_input.connect(_on_gui_input)
	
	# Initialize card display
	if not card_id.is_empty():
		load_card_data()
		update_visual_display()
	
	# Set up highlight
	highlight.color = Color(1, 1, 1, 0)
	highlight.mouse_filter = Control.MOUSE_FILTER_IGNORE

func load_card_data():
	"""Load card data from GameState singleton"""
	card_data = GameState.get_card_data(card_id)
	if card_data.is_empty():
		print("Warning: No card data found for " + card_id)

func update_visual_display():
	"""Update the visual appearance based on card data"""
	if card_data.is_empty():
		return
	
	# Update text labels
	if name_label:
		name_label.text = card_data.get("name", "Unknown")
	if cost_label:
		cost_label.text = str(card_data.get("cost", 0))
	if type_label:
		type_label.text = card_data.get("type", "Unknown")
	if stats_label:
		var power = card_data.get("power", 0)
		var toughness = card_data.get("toughness", 0)
		stats_label.text = str(power) + "/" + str(toughness)
	
	# Update card texture
	if card_sprite:
		var texture = front_texture if is_face_up else back_texture
		card_sprite.texture = texture
		
	# Show/hide info based on face up state
	if info_container:
		info_container.visible = is_face_up

func _on_gui_input(event: InputEvent):
	"""Handle input events for the card"""
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

func _handle_single_click():
	"""Handle single click - selection and signals"""
	# Toggle selection if shift is held
	if Input.is_action_pressed("multi_select"):
		set_selected(not is_selected)
	else:
		set_selected(true)
	
	card_clicked.emit(self)

func _handle_double_click():
	"""Handle double click - auto-play to default zone"""
	card_double_clicked.emit(self)
	_auto_play_card()

func _handle_right_click():
	"""Handle right click - show context menu"""
	card_right_clicked.emit(self)
	_show_context_menu()

func _start_drag(mouse_pos: Vector2):
	"""Initialize card dragging"""
	if not is_draggable:
		return
		
	is_dragging = true
	drag_offset = mouse_pos
	original_position = position
	original_parent = get_parent()
	
	# Move to top level for dragging
	var root = get_tree().current_scene
	reparent(root)
	z_index = 100
	
	drag_started.emit(self)

func _end_drag():
	"""End card dragging and handle zone detection"""
	if not is_dragging:
		return
		
	is_dragging = false
	var target_zone = _detect_drop_zone()
	
	if target_zone:
		# Snap to zone
		_snap_to_zone(target_zone)
		drag_ended.emit(self, target_zone)
	else:
		# Return to original position
		_return_to_original_position()
	
	z_index = 0

func _process(_delta):
	"""Handle continuous dragging updates"""
	if is_dragging:
		position = get_global_mouse_position() - drag_offset

func _detect_drop_zone() -> Node:
	"""Detect which zone the card is being dropped on"""
	var board = get_node_or_null("/root/Board")
	if not board:
		return null
	
	var card_center = global_position + size / 2
	
	# Check each zone container
	for zone_name in ["FlagZone", "LifeZone", "CombatRowZone", "FieldZone", "DeckZone", "RemovedZone", "AzothRowZone"]:
		var zone = board.get_node_or_null(zone_name)
		if zone and zone is Control:
			var zone_rect = Rect2(zone.global_position, zone.size)
			if zone_rect.has_point(card_center):
				return zone
	
	return null

func _snap_to_zone(zone: Node):
	"""Snap card to the target zone with grid alignment"""
	if not zone:
		return
	
	# Get zone-specific snapping behavior
	var snap_position = _calculate_snap_position(zone)
	
	# Reparent to zone
	reparent(zone)
	
	# Animate to snap position
	var tween = create_tween()
	tween.tween_property(self, "position", snap_position, animation_duration)
	tween.tween_callback(_update_game_state_for_zone.bind(zone))

func _calculate_snap_position(zone: Node) -> Vector2:
	"""Calculate the snap position within a zone"""
	var zone_name = zone.name
	
	match zone_name:
		"CombatRowZone", "FieldZone", "AzothRowZone":
			# Grid-based snapping for main play areas
			return _snap_to_grid(zone)
		"FlagZone", "LifeZone", "DeckZone", "RemovedZone":
			# Stack-based snapping for utility zones
			return _snap_to_stack(zone)
		_:
			# Default center position
			return Vector2(10, 10)

func _snap_to_grid(zone: Node) -> Vector2:
	"""Snap to grid position in zone"""
	var grid_size = Vector2(130, 180)  # Card size + padding
	var cards_in_zone = zone.get_children().size()
	var columns = max(1, int(zone.size.x / grid_size.x))
	
	var row = cards_in_zone / columns
	var col = cards_in_zone % columns
	
	return Vector2(col * grid_size.x + 10, row * grid_size.y + 10)

func _snap_to_stack(zone: Node) -> Vector2:
	"""Snap to stack position in zone"""
	var cards_in_zone = zone.get_children().size()
	var offset = Vector2(2, 2) * cards_in_zone  # Slight offset for stacking effect
	
	return Vector2(10, 10) + offset

func _return_to_original_position():
	"""Return card to its original position"""
	reparent(original_parent)
	
	var tween = create_tween()
	tween.tween_property(self, "position", original_position, animation_duration)

func _update_game_state_for_zone(zone: Node):
	"""Update GameState when card moves to new zone"""
	var zone_type = _get_zone_type_from_node(zone)
	if zone_type != -1:
		GameState.add_card_to_zone(card_id, zone_type)

func _get_zone_type_from_node(zone: Node) -> int:
	"""Convert zone node to GameState.ZoneType enum"""
	match zone.name:
		"FlagZone":
			return GameState.ZoneType.FLAG
		"LifeZone":
			return GameState.ZoneType.LIFE
		"CombatRowZone":
			return GameState.ZoneType.COMBAT_ROW
		"FieldZone":
			return GameState.ZoneType.FIELD
		"DeckZone":
			return GameState.ZoneType.DECK
		"RemovedZone":
			return GameState.ZoneType.REMOVED_FROM_PLAY
		"AzothRowZone":
			return GameState.ZoneType.AZOTH_ROW
		_:
			return -1

func _auto_play_card():
	"""Auto-play card to its default zone"""
	# Simple logic: creatures go to field, others to appropriate zones
	var target_zone_type = GameState.ZoneType.FIELD
	
	if card_data.get("type", "") == "Land":
		target_zone_type = GameState.ZoneType.FIELD
	elif card_data.get("type", "") == "Creature":
		target_zone_type = GameState.ZoneType.FIELD
	else:
		target_zone_type = GameState.ZoneType.FIELD
	
	GameState.add_card_to_zone(card_id, target_zone_type)

func _show_context_menu():
	"""Show context menu for card actions"""
	# TODO: Implement context menu
	print("Context menu for card: " + card_data.get("name", card_id))

func _on_mouse_entered():
	"""Handle mouse hover start"""
	is_hovered = true
	_animate_hover_effect(true)

func _on_mouse_exited():
	"""Handle mouse hover end"""
	is_hovered = false
	_animate_hover_effect(false)

func _animate_hover_effect(hover: bool):
	"""Animate hover elevation and highlight"""
	var tween = create_tween()
	tween.parallel()
	
	# Elevation effect
	var target_y = original_position.y if not hover else original_position.y - hover_elevation
	if not is_dragging:  # Don't interfere with dragging
		tween.tween_property(self, "position:y", target_y, animation_duration)
	
	# Highlight effect  
	var highlight_alpha = 0.0 if not hover else 0.3
	tween.tween_property(highlight, "color:a", highlight_alpha, animation_duration)

func set_selected(selected: bool):
	"""Set card selection state"""
	is_selected = selected
	
	# Update visual feedback
	if card_frame:
		card_frame.modulate = Color.WHITE if not selected else Color.YELLOW

func flip_card():
	"""Flip the card between face up and face down"""
	is_face_up = not is_face_up
	update_visual_display()

func set_card_id(new_id: String):
	"""Set the card ID and reload data"""
	card_id = new_id
	load_card_data()
	update_visual_display()