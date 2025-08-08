extends Control

# Board script - handles layout, drag/drop coordination, and zone management
# Implements the custom zone layout: FLAG, LIFE, Combat Row, Field, Deck, Removed From Play, Azoth Row

signal board_ready()
signal card_zone_changed(card_id: String, from_zone: String, to_zone: String)

# Zone container references
@onready var flag_zone: Control = $ZoneContainer/FlagZone
@onready var life_zone: Control = $ZoneContainer/LifeZone
@onready var combat_row_zone: Control = $ZoneContainer/CombatRowZone
@onready var field_zone: Control = $ZoneContainer/FieldZone
@onready var deck_zone: Control = $ZoneContainer/DeckZone
@onready var removed_zone: Control = $ZoneContainer/RemovedZone
@onready var azoth_row_zone: Control = $ZoneContainer/AzothRowZone

# UI elements
@onready var player1_life_label: Label = $UI/LifeContainer/Player1Life
@onready var player2_life_label: Label = $UI/LifeContainer/Player2Life
@onready var player1_azoth_label: Label = $UI/AzothContainer/Player1Azoth
@onready var player2_azoth_label: Label = $UI/AzothContainer/Player2Azoth
@onready var turn_label: Label = $UI/TurnContainer/TurnLabel
@onready var phase_label: Label = $UI/TurnContainer/PhaseLabel

# Card management
var card_scene: PackedScene
var active_cards: Array[Node] = []
var selected_cards: Array[Node] = []

# Layout settings
var zone_margins: Vector2 = Vector2(10, 10)
var card_spacing: Vector2 = Vector2(130, 180)

func _ready():
	print("Board initializing...")
	
	# Load card scene
	card_scene = preload("res://scenes/Card.tscn")
	
	# Connect to GameState signals
	GameState.game_state_updated.connect(_on_game_state_updated)
	GameState.zone_changed.connect(_on_zone_changed)
	GameState.turn_changed.connect(_on_turn_changed)
	
	# Set up initial layout
	_setup_zone_layout()
	_setup_ui()
	
	# Spawn initial demo cards
	call_deferred("_spawn_demo_cards")
	
	board_ready.emit()
	print("Board ready!")

func _setup_zone_layout():
	"""Configure the zone layout according to specifications"""
	var screen_size = get_viewport().get_visible_rect().size
	var zone_container = $ZoneContainer
	
	# Calculate zone positions based on the provided layout diagram
	# FLAG zone (top-left)
	flag_zone.position = Vector2(zone_margins.x, zone_margins.y)
	flag_zone.size = Vector2(150, 100)
	
	# LIFE zone (mid-left)
	life_zone.position = Vector2(zone_margins.x, screen_size.y / 2 - 50)
	life_zone.size = Vector2(150, 100)
	
	# Deck zone (top-right)
	deck_zone.position = Vector2(screen_size.x - 160 - zone_margins.x, zone_margins.y)
	deck_zone.size = Vector2(150, 100)
	
	# Removed From Play zone (mid-right)
	removed_zone.position = Vector2(screen_size.x - 160 - zone_margins.x, screen_size.y / 2 - 50)
	removed_zone.size = Vector2(150, 100)
	
	# Combat Row (horizontal container above Field)
	var field_y = screen_size.y / 2 - 100
	combat_row_zone.position = Vector2(200, field_y - 200)
	combat_row_zone.size = Vector2(screen_size.x - 400, 180)
	
	# Field (central play area)
	field_zone.position = Vector2(200, field_y)
	field_zone.size = Vector2(screen_size.x - 400, 200)
	
	# Azoth Row (full-width bottom bar)
	azoth_row_zone.position = Vector2(zone_margins.x, screen_size.y - 190)
	azoth_row_zone.size = Vector2(screen_size.x - zone_margins.x * 2, 180)
	
	# Add visual styling to zones
	_style_zones()

func _style_zones():
	"""Add visual styling and backgrounds to zones"""
	var zones = [flag_zone, life_zone, combat_row_zone, field_zone, deck_zone, removed_zone, azoth_row_zone]
	var zone_names = ["FLAG", "LIFE", "COMBAT", "FIELD", "DECK", "REMOVED", "AZOTH"]
	
	for i in zones.size():
		var zone = zones[i]
		var zone_name = zone_names[i]
		
		# Add background panel
		var background = ColorRect.new()
		background.name = "Background"
		background.color = Color(0.2, 0.2, 0.3, 0.3)
		background.size = zone.size
		background.position = Vector2.ZERO
		background.mouse_filter = Control.MOUSE_FILTER_IGNORE
		zone.add_child(background)
		zone.move_child(background, 0)  # Send to back
		
		# Add zone label
		var label = Label.new()
		label.name = "ZoneLabel"
		label.text = zone_name
		label.add_theme_color_override("font_color", Color.WHITE)
		label.position = Vector2(5, 5)
		label.mouse_filter = Control.MOUSE_FILTER_IGNORE
		zone.add_child(label)

func _setup_ui():
	"""Set up the user interface elements"""
	# Create UI container if it doesn't exist
	if not has_node("UI"):
		var ui = Control.new()
		ui.name = "UI"
		ui.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		add_child(ui)
		
		# Life container
		var life_container = VBoxContainer.new()
		life_container.name = "LifeContainer"
		life_container.position = Vector2(20, 20)
		ui.add_child(life_container)
		
		player1_life_label = Label.new()
		player1_life_label.name = "Player1Life"
		player1_life_label.text = "P1 Life: 20"
		player1_life_label.add_theme_color_override("font_color", Color.GREEN)
		life_container.add_child(player1_life_label)
		
		player2_life_label = Label.new()
		player2_life_label.name = "Player2Life"
		player2_life_label.text = "P2 Life: 20"
		player2_life_label.add_theme_color_override("font_color", Color.RED)
		life_container.add_child(player2_life_label)
		
		# Azoth container
		var azoth_container = VBoxContainer.new()
		azoth_container.name = "AzothContainer"
		azoth_container.position = Vector2(20, 80)
		ui.add_child(azoth_container)
		
		player1_azoth_label = Label.new()
		player1_azoth_label.name = "Player1Azoth"
		player1_azoth_label.text = "P1 Azoth: 0"
		player1_azoth_label.add_theme_color_override("font_color", Color.CYAN)
		azoth_container.add_child(player1_azoth_label)
		
		player2_azoth_label = Label.new()
		player2_azoth_label.name = "Player2Azoth"
		player2_azoth_label.text = "P2 Azoth: 0"
		player2_azoth_label.add_theme_color_override("font_color", Color.MAGENTA)
		azoth_container.add_child(player2_azoth_label)
		
		# Turn container
		var turn_container = VBoxContainer.new()
		turn_container.name = "TurnContainer"
		turn_container.position = Vector2(get_viewport().get_visible_rect().size.x - 200, 20)
		ui.add_child(turn_container)
		
		turn_label = Label.new()
		turn_label.name = "TurnLabel"
		turn_label.text = "Turn 1 - Player 1"
		turn_label.add_theme_color_override("font_color", Color.WHITE)
		turn_container.add_child(turn_label)
		
		phase_label = Label.new()
		phase_label.name = "PhaseLabel"
		phase_label.text = "Main Phase"
		phase_label.add_theme_color_override("font_color", Color.YELLOW)
		turn_container.add_child(phase_label)

func _spawn_demo_cards():
	"""Spawn demo cards for testing"""
	var deck_cards = GameState.get_cards_in_zone(GameState.ZoneType.DECK)
	
	for card_id in deck_cards:
		var card_node = card_scene.instantiate()
		card_node.name = card_id
		card_node.set_card_id(card_id)
		
		# Connect card signals
		card_node.card_clicked.connect(_on_card_clicked)
		card_node.card_double_clicked.connect(_on_card_double_clicked)
		card_node.card_right_clicked.connect(_on_card_right_clicked)
		card_node.drag_started.connect(_on_card_drag_started)
		card_node.drag_ended.connect(_on_card_drag_ended)
		
		# Add to deck zone
		deck_zone.add_child(card_node)
		active_cards.append(card_node)
		
		# Position cards in a stack
		var card_index = deck_zone.get_children().size() - 2  # -1 for background, -1 for label
		card_node.position = Vector2(10, 30) + Vector2(2, 2) * card_index

func _on_game_state_updated():
	"""Handle GameState updates"""
	# Update UI displays
	_update_ui_displays()

func _on_zone_changed(card_id: String, from_zone: String, to_zone: String):
	"""Handle card zone changes"""
	print("Card " + card_id + " moved from " + from_zone + " to " + to_zone)
	card_zone_changed.emit(card_id, from_zone, to_zone)

func _on_turn_changed(player: int, turn_count: int):
	"""Handle turn changes"""
	if turn_label:
		turn_label.text = "Turn " + str(turn_count) + " - Player " + str(player)

func _update_ui_displays():
	"""Update all UI displays with current game state"""
	var p1_data = GameState.get_player_data(1)
	var p2_data = GameState.get_player_data(2)
	
	if player1_life_label and p1_data:
		player1_life_label.text = "P1 Life: " + str(p1_data.get("life", 20))
	
	if player2_life_label and p2_data:
		player2_life_label.text = "P2 Life: " + str(p2_data.get("life", 20))
	
	if player1_azoth_label and p1_data:
		player1_azoth_label.text = "P1 Azoth: " + str(p1_data.get("azoth", 0))
	
	if player2_azoth_label and p2_data:
		player2_azoth_label.text = "P2 Azoth: " + str(p2_data.get("azoth", 0))

# Card interaction handlers
func _on_card_clicked(card: Node):
	"""Handle card click"""
	if not Input.is_action_pressed("multi_select"):
		# Clear other selections
		for selected_card in selected_cards:
			if selected_card != card:
				selected_card.set_selected(false)
		selected_cards.clear()
	
	if not selected_cards.has(card):
		selected_cards.append(card)
		card.set_selected(true)

func _on_card_double_clicked(card: Node):
	"""Handle card double click"""
	print("Card double-clicked: " + card.card_id)

func _on_card_right_clicked(card: Node):
	"""Handle card right click"""
	print("Card right-clicked: " + card.card_id)

func _on_card_drag_started(card: Node):
	"""Handle drag start"""
	print("Drag started: " + card.card_id)

func _on_card_drag_ended(card: Node, target_zone: Node):
	"""Handle drag end"""
	if target_zone:
		print("Card " + card.card_id + " dropped on " + target_zone.name)
	else:
		print("Card " + card.card_id + " drag cancelled")

# Input handling
func _input(event):
	"""Handle global input events"""
	if event is InputEventKey and event.pressed:
		match event.keycode:
			KEY_SPACE:
				GameState.next_turn()
			KEY_R:
				_reset_board()
			KEY_ESCAPE:
				_clear_selections()

func _clear_selections():
	"""Clear all card selections"""
	for card in selected_cards:
		card.set_selected(false)
	selected_cards.clear()

func _reset_board():
	"""Reset the board to initial state"""
	print("Resetting board...")
	# TODO: Implement board reset functionality

# Utility functions
func get_zone_by_type(zone_type: GameState.ZoneType) -> Control:
	"""Get zone node by ZoneType enum"""
	match zone_type:
		GameState.ZoneType.FLAG:
			return flag_zone
		GameState.ZoneType.LIFE:
			return life_zone
		GameState.ZoneType.COMBAT_ROW:
			return combat_row_zone
		GameState.ZoneType.FIELD:
			return field_zone
		GameState.ZoneType.DECK:
			return deck_zone
		GameState.ZoneType.REMOVED_FROM_PLAY:
			return removed_zone
		GameState.ZoneType.AZOTH_ROW:
			return azoth_row_zone
		_:
			return null

func add_card_to_board(card_id: String, zone_type: GameState.ZoneType):
	"""Add a new card to the board in the specified zone"""
	var card_node = card_scene.instantiate()
	card_node.name = card_id
	card_node.set_card_id(card_id)
	
	# Connect signals
	card_node.card_clicked.connect(_on_card_clicked)
	card_node.card_double_clicked.connect(_on_card_double_clicked)
	card_node.card_right_clicked.connect(_on_card_right_clicked)
	card_node.drag_started.connect(_on_card_drag_started)
	card_node.drag_ended.connect(_on_card_drag_ended)
	
	var target_zone = get_zone_by_type(zone_type)
	if target_zone:
		target_zone.add_child(card_node)
		active_cards.append(card_node)
		
		# Position appropriately
		card_node.position = card_node._calculate_snap_position(target_zone)