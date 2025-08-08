extends Control

# MTG Arena-style board implementation
# Complete replica of Magic: The Gathering Arena's game board with all standard zones

signal board_ready()
signal card_zone_changed(card_id: String, from_zone: String, to_zone: String)

# MTG Arena zone references
@onready var player_battlefield: Control
@onready var opponent_battlefield: Control  
@onready var player_hand: Control
@onready var opponent_hand: Control
@onready var player_library: Control
@onready var opponent_library: Control
@onready var player_graveyard: Control
@onready var opponent_graveyard: Control
@onready var player_mana: Control
@onready var opponent_mana: Control
@onready var stack_zone: Control
@onready var exile_zone: Control

# UI elements - MTG Arena style
@onready var player_life_display: Label
@onready var opponent_life_display: Label
@onready var player_mana_display: Label
@onready var opponent_mana_display: Label
@onready var turn_indicator: Label
@onready var phase_indicator: Label
@onready var priority_indicator: Control
@onready var emote_panel: Control
@onready var settings_button: Button
@onready var concede_button: Button

# Card management
var card_scene: PackedScene
var active_cards: Array[Node] = []
var selected_cards: Array[Node] = []
var tweener: Tween

# Layout settings for MTG Arena proportions
var arena_margins: Vector2 = Vector2(20, 20)
var card_spacing: Vector2 = Vector2(140, 200)

func _ready():
	print("MTG Arena Board initializing...")
	
	# Load card scene
	card_scene = preload("res://scenes/Card.tscn")
	
	# Connect to GameState signals  
	GameState.game_state_updated.connect(_on_game_state_updated)
	GameState.zone_changed.connect(_on_zone_changed)
	GameState.turn_changed.connect(_on_turn_changed)
	
	# Set up MTG Arena layout
	_setup_mtg_arena_layout()
	_setup_mtg_arena_ui()
	
	# Initialize with demo cards
	call_deferred("_spawn_demo_cards")
	
	board_ready.emit()
	print("MTG Arena Board ready!")

func _setup_mtg_arena_layout():
	"""Configure the exact MTG Arena zone layout"""
	var screen_size = get_viewport().get_visible_rect().size
	
	# Create main container for zones
	var zone_container = Control.new()
	zone_container.name = "ZoneContainer" 
	zone_container.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(zone_container)
	
	# Create MTG Arena-style table background (hourglass shape)
	_create_arena_table(zone_container, screen_size)
	
	# Player battlefield (bottom center)
	player_battlefield = Control.new()
	player_battlefield.name = "PlayerBattlefield"
	player_battlefield.position = Vector2(screen_size.x * 0.2, screen_size.y * 0.55)
	player_battlefield.size = Vector2(screen_size.x * 0.6, screen_size.y * 0.25)
	zone_container.add_child(player_battlefield)
	
	# Opponent battlefield (top center) 
	opponent_battlefield = Control.new()
	opponent_battlefield.name = "OpponentBattlefield"
	opponent_battlefield.position = Vector2(screen_size.x * 0.2, screen_size.y * 0.2)
	opponent_battlefield.size = Vector2(screen_size.x * 0.6, screen_size.y * 0.25)
	zone_container.add_child(opponent_battlefield)
	
	# Player hand (bottom)
	player_hand = Control.new()
	player_hand.name = "PlayerHand"
	player_hand.position = Vector2(screen_size.x * 0.15, screen_size.y * 0.85)
	player_hand.size = Vector2(screen_size.x * 0.7, screen_size.y * 0.12)
	zone_container.add_child(player_hand)
	
	# Opponent hand (top, hidden cards)
	opponent_hand = Control.new()
	opponent_hand.name = "OpponentHand"  
	opponent_hand.position = Vector2(screen_size.x * 0.15, screen_size.y * 0.03)
	opponent_hand.size = Vector2(screen_size.x * 0.7, screen_size.y * 0.12)
	zone_container.add_child(opponent_hand)
	
	# Library zones (right side)
	player_library = Control.new()
	player_library.name = "PlayerLibrary"
	player_library.position = Vector2(screen_size.x * 0.85, screen_size.y * 0.6)
	player_library.size = Vector2(screen_size.x * 0.12, screen_size.y * 0.15)
	zone_container.add_child(player_library)
	
	opponent_library = Control.new()
	opponent_library.name = "OpponentLibrary"
	opponent_library.position = Vector2(screen_size.x * 0.85, screen_size.y * 0.25)
	opponent_library.size = Vector2(screen_size.x * 0.12, screen_size.y * 0.15)
	zone_container.add_child(opponent_library)
	
	# Graveyard zones (left side)
	player_graveyard = Control.new()
	player_graveyard.name = "PlayerGraveyard"
	player_graveyard.position = Vector2(screen_size.x * 0.03, screen_size.y * 0.6)
	player_graveyard.size = Vector2(screen_size.x * 0.12, screen_size.y * 0.15)
	zone_container.add_child(player_graveyard)
	
	opponent_graveyard = Control.new()
	opponent_graveyard.name = "OpponentGraveyard"
	opponent_graveyard.position = Vector2(screen_size.x * 0.03, screen_size.y * 0.25)
	opponent_graveyard.size = Vector2(screen_size.x * 0.12, screen_size.y * 0.15)
	zone_container.add_child(opponent_graveyard)
	
	# Stack zone (center)
	stack_zone = Control.new()
	stack_zone.name = "Stack"
	stack_zone.position = Vector2(screen_size.x * 0.45, screen_size.y * 0.45)
	stack_zone.size = Vector2(screen_size.x * 0.1, screen_size.y * 0.1)
	zone_container.add_child(stack_zone)
	
	# Exile zone (far right)
	exile_zone = Control.new()
	exile_zone.name = "Exile"
	exile_zone.position = Vector2(screen_size.x * 0.88, screen_size.y * 0.45)
	exile_zone.size = Vector2(screen_size.x * 0.09, screen_size.y * 0.1)
	zone_container.add_child(exile_zone)
	
	# Add visual styling
	_style_mtg_zones()

func _create_arena_table(container: Control, screen_size: Vector2):
	"""Create the distinctive MTG Arena hourglass table"""
	var table_bg = ColorRect.new()
	table_bg.name = "ArenaTable"
	table_bg.color = Color(0.4, 0.3, 0.2, 1.0)  # Warm brown
	table_bg.position = Vector2(screen_size.x * 0.1, screen_size.y * 0.15)
	table_bg.size = Vector2(screen_size.x * 0.8, screen_size.y * 0.7)
	container.add_child(table_bg)
	
	# Golden border effect
	var border = ReferenceRect.new()
	border.border_color = Color(0.8, 0.6, 0.2, 1.0)  # Golden
	border.border_width = 4
	border.position = table_bg.position - Vector2(2, 2)
	border.size = table_bg.size + Vector2(4, 4)
	container.add_child(border)

func _style_mtg_zones():
	"""Add MTG Arena-style visual styling to all zones"""
	var all_zones = [
		player_battlefield, opponent_battlefield, player_hand, opponent_hand,
		player_library, opponent_library, player_graveyard, opponent_graveyard,
		stack_zone, exile_zone
	]
	
	var zone_names = [
		"Player Battlefield", "Opponent Battlefield", "Player Hand", "Opponent Hand",
		"Player Library", "Opponent Library", "Player Graveyard", "Opponent Graveyard", 
		"Stack", "Exile"
	]
	
	for i in all_zones.size():
		var zone = all_zones[i]
		var zone_name = zone_names[i]
		
		# Subtle zone background
		var background = ColorRect.new()
		background.name = "ZoneBackground"
		background.color = Color(0.1, 0.1, 0.15, 0.3)
		background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		background.mouse_filter = Control.MOUSE_FILTER_IGNORE
		zone.add_child(background)
		
		# Zone border highlight
		var border = ReferenceRect.new()
		border.name = "ZoneBorder"
		border.border_color = Color(0.3, 0.5, 0.7, 0.5)
		border.border_width = 1
		border.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		border.mouse_filter = Control.MOUSE_FILTER_IGNORE
		zone.add_child(border)
		
		# Zone label (small, Arena-style)
		var label = Label.new()
		label.name = "ZoneLabel"
		label.text = zone_name
		label.add_theme_color_override("font_color", Color(0.7, 0.7, 0.8, 0.8))
		label.add_theme_font_size_override("font_size", 10)
		label.position = Vector2(5, 2)
		label.mouse_filter = Control.MOUSE_FILTER_IGNORE
		zone.add_child(label)
		
		# Enable mouse interaction for drag-drop
		zone.mouse_filter = Control.MOUSE_FILTER_PASS
		zone.connect("mouse_entered", _on_zone_mouse_entered.bind(zone_name))
		zone.connect("mouse_exited", _on_zone_mouse_exited.bind(zone_name))

func _setup_mtg_arena_ui():
	"""Set up MTG Arena-style user interface"""
	var screen_size = get_viewport().get_visible_rect().size
	
	# Create main UI container
	var ui = Control.new()
	ui.name = "ArenaUI"
	ui.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(ui)
	
	# Player life display (bottom left, Arena style)
	var player_life_container = PanelContainer.new()
	player_life_container.position = Vector2(20, screen_size.y - 120)
	player_life_container.size = Vector2(100, 40)
	ui.add_child(player_life_container)
	
	player_life_display = Label.new()
	player_life_display.text = "20"
	player_life_display.add_theme_font_size_override("font_size", 24)
	player_life_display.add_theme_color_override("font_color", Color.WHITE)
	player_life_display.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	player_life_display.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	player_life_container.add_child(player_life_display)
	
	# Opponent life display (top left)
	var opponent_life_container = PanelContainer.new()
	opponent_life_container.position = Vector2(20, 80)
	opponent_life_container.size = Vector2(100, 40) 
	ui.add_child(opponent_life_container)
	
	opponent_life_display = Label.new()
	opponent_life_display.text = "20"
	opponent_life_display.add_theme_font_size_override("font_size", 24)
	opponent_life_display.add_theme_color_override("font_color", Color.WHITE)
	opponent_life_display.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	opponent_life_display.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	opponent_life_container.add_child(opponent_life_display)
	
	# Turn and phase indicators (top center, Arena style)
	var game_info_container = VBoxContainer.new()
	game_info_container.position = Vector2(screen_size.x * 0.45, 20)
	game_info_container.size = Vector2(200, 60)
	ui.add_child(game_info_container)
	
	turn_indicator = Label.new()
	turn_indicator.text = "Turn 1"
	turn_indicator.add_theme_font_size_override("font_size", 16)
	turn_indicator.add_theme_color_override("font_color", Color.WHITE)
	turn_indicator.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game_info_container.add_child(turn_indicator)
	
	phase_indicator = Label.new()
	phase_indicator.text = "Main Phase"
	phase_indicator.add_theme_font_size_override("font_size", 14)
	phase_indicator.add_theme_color_override("font_color", Color(0.8, 0.8, 0.2))
	phase_indicator.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game_info_container.add_child(phase_indicator)
	
	# Priority indicator (glowing ring effect)
	priority_indicator = Control.new()
	priority_indicator.name = "PriorityIndicator"
	priority_indicator.position = Vector2(screen_size.x * 0.48, screen_size.y * 0.48)
	priority_indicator.size = Vector2(60, 60)
	ui.add_child(priority_indicator)
	
	var priority_ring = ColorRect.new()
	priority_ring.color = Color(0.2, 0.8, 1.0, 0.6)
	priority_ring.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	priority_indicator.add_child(priority_ring)
	priority_indicator.visible = false
	
	# Settings and concede buttons (top right)
	var button_container = HBoxContainer.new()
	button_container.position = Vector2(screen_size.x - 180, 20)
	button_container.size = Vector2(160, 40)
	ui.add_child(button_container)
	
	settings_button = Button.new()
	settings_button.text = "Settings"
	settings_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	button_container.add_child(settings_button)
	
	concede_button = Button.new()
	concede_button.text = "Concede"
	concede_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	button_container.add_child(concede_button)
	
	# Emote/chat panel (right side)
	emote_panel = Panel.new()
	emote_panel.position = Vector2(screen_size.x - 200, screen_size.y * 0.3)
	emote_panel.size = Vector2(180, 300)
	emote_panel.visible = false  # Hidden by default like Arena
	ui.add_child(emote_panel)

func _spawn_demo_cards():
	"""Spawn demo cards in MTG Arena style"""
	# Add cards to player hand
	for i in range(7):
		var card_node = card_scene.instantiate()
		card_node.name = "hand_card_" + str(i)
		
		# Connect card interaction signals
		if card_node.has_signal("card_clicked"):
			card_node.card_clicked.connect(_on_card_clicked)
		if card_node.has_signal("card_double_clicked"): 
			card_node.card_double_clicked.connect(_on_card_double_clicked)
		if card_node.has_signal("drag_started"):
			card_node.drag_started.connect(_on_card_drag_started)
		if card_node.has_signal("drag_ended"):
			card_node.drag_ended.connect(_on_card_drag_ended)
		
		player_hand.add_child(card_node)
		active_cards.append(card_node)
		
		# Position in hand spread
		var hand_spacing = player_hand.size.x / 8
		card_node.position = Vector2(hand_spacing * (i + 1) - 70, 10)
		card_node.scale = Vector2(0.8, 0.8)  # Slightly smaller in hand

func _on_zone_mouse_entered(zone_name: String):
	"""Handle mouse entering zone for hover effects"""
	# Subtle glow effect like MTG Arena
	pass

func _on_zone_mouse_exited(zone_name: String):
	"""Handle mouse exiting zone"""
	pass

# Card interaction handlers
func _on_card_clicked(card: Node):
	"""Handle card click with MTG Arena-style selection"""
	if not Input.is_action_pressed("multi_select"):
		_clear_selections()
	
	if not selected_cards.has(card):
		selected_cards.append(card)
		# Add selection glow
		var glow = ColorRect.new()
		glow.name = "SelectionGlow"
		glow.color = Color(0.2, 0.8, 1.0, 0.3)
		glow.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		glow.mouse_filter = Control.MOUSE_FILTER_IGNORE
		card.add_child(glow)

func _on_card_double_clicked(card: Node):
	"""Handle card double click for auto-play"""
	print("Auto-playing card: " + card.name)
	# Move to battlefield
	_move_card_to_zone(card, player_battlefield)

func _on_card_drag_started(card: Node):
	"""Handle drag start with Arena-style effects"""
	card.modulate = Color(1.0, 1.0, 1.0, 0.8)  # Semi-transparent while dragging
	card.z_index = 100  # Bring to front

func _on_card_drag_ended(card: Node, drop_position: Vector2):
	"""Handle drag end with zone snapping"""
	card.modulate = Color.WHITE
	card.z_index = 0
	
	# Find target zone and move card
	var target_zone = _get_zone_at_position(drop_position)
	if target_zone:
		_move_card_to_zone(card, target_zone)
	else:
		# Return to original position
		var tween = create_tween()
		tween.tween_property(card, "position", card.get_meta("original_position", Vector2.ZERO), 0.3)

func _move_card_to_zone(card: Node, target_zone: Control):
	"""Move card to target zone with smooth animation"""
	var old_parent = card.get_parent()
	
	# Store original position for return
	card.set_meta("original_position", card.position)
	
	# Reparent to target zone
	old_parent.remove_child(card)
	target_zone.add_child(card)
	
	# Calculate new position
	var new_pos = Vector2(target_zone.size.x / 2 - card.size.x / 2, target_zone.size.y / 2 - card.size.y / 2)
	
	# Smooth animation
	var tween = create_tween()
	tween.tween_property(card, "position", new_pos, 0.4)
	tween.parallel().tween_property(card, "scale", Vector2.ONE, 0.4)

func _get_zone_at_position(global_pos: Vector2) -> Control:
	"""Find which zone contains the given position"""
	var all_zones = [
		player_battlefield, opponent_battlefield, player_hand, opponent_hand,
		player_library, opponent_library, player_graveyard, opponent_graveyard,
		stack_zone, exile_zone
	]
	
	for zone in all_zones:
		var zone_rect = Rect2(zone.global_position, zone.size)
		if zone_rect.has_point(global_pos):
			return zone
	
	return null

func _clear_selections():
	"""Clear all card selections"""
	for card in selected_cards:
		var glow = card.get_node_or_null("SelectionGlow")
		if glow:
			glow.queue_free()
	selected_cards.clear()

# GameState event handlers
func _on_game_state_updated():
	"""Update UI when game state changes"""
	_update_arena_displays()

func _on_zone_changed(card_id: String, from_zone: String, to_zone: String):
	"""Handle zone changes"""
	print("MTG Arena: Card moved from " + from_zone + " to " + to_zone)
	card_zone_changed.emit(card_id, from_zone, to_zone)

func _on_turn_changed(player: int, turn_count: int):
	"""Handle turn changes with Arena-style updates"""
	turn_indicator.text = "Turn " + str(turn_count)
	
	# Show priority indicator
	priority_indicator.visible = true
	var tween = create_tween()
	tween.tween_property(priority_indicator, "modulate:a", 0.0, 1.0)
	tween.tween_callback(func(): priority_indicator.visible = false)

func _update_arena_displays():
	"""Update all Arena-style displays"""
	var p1_data = GameState.get_player_data(1)
	var p2_data = GameState.get_player_data(2)
	
	if player_life_display and p1_data:
		player_life_display.text = str(p1_data.get("life", 20))
	
	if opponent_life_display and p2_data:
		opponent_life_display.text = str(p2_data.get("life", 20))

# Input handling
func _input(event):
	"""Handle Arena-style input events"""
	if event is InputEventKey and event.pressed:
		match event.keycode:
			KEY_SPACE:
				GameState.next_turn()
			KEY_ENTER:
				# Pass priority
				priority_indicator.visible = false
			KEY_ESCAPE:
				_clear_selections()
			KEY_F6:
				# Skip to end step (Arena hotkey)
				phase_indicator.text = "End Step"
