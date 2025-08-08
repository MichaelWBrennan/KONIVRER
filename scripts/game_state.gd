extends Node

# GameState singleton - tracks card ownership, zone contents, turn info
# Handles all game state management for the Azoth TCG framework

signal zone_changed(card_id: String, from_zone: String, to_zone: String)
signal card_played(card_id: String, zone: String)
signal card_removed(card_id: String, zone: String)
signal turn_changed(player: int, turn_count: int)
signal game_state_updated()

# Game state variables
var current_turn: int = 1
var current_player: int = 1
var turn_count: int = 1

# Zone definitions matching the required layout
enum ZoneType {
	FLAG,
	LIFE, 
	COMBAT_ROW,
	FIELD,
	DECK,
	REMOVED_FROM_PLAY,
	AZOTH_ROW
}

# Zone containers - each zone holds array of card IDs
var zones: Dictionary = {
	ZoneType.FLAG: [],
	ZoneType.LIFE: [],
	ZoneType.COMBAT_ROW: [],
	ZoneType.FIELD: [],
	ZoneType.DECK: [],
	ZoneType.REMOVED_FROM_PLAY: [],
	ZoneType.AZOTH_ROW: []
}

# Card registry - tracks all cards and their properties
var cards: Dictionary = {}

# Player data
var players: Dictionary = {
	1: {
		"name": "Player 1",
		"life": 20,
		"azoth": 0
	},
	2: {
		"name": "Player 2", 
		"life": 20,
		"azoth": 0
	}
}

func _ready():
	print("GameState singleton initialized")
	_initialize_demo_cards()

func _initialize_demo_cards():
	"""Initialize some demo cards for testing"""
	for i in range(10):
		var card_id = "card_" + str(i)
		var card_data = {
			"id": card_id,
			"name": "Demo Card " + str(i),
			"cost": randi_range(1, 7),
			"type": "Creature",
			"power": randi_range(1, 5),
			"toughness": randi_range(1, 5),
			"owner": 1 if i < 5 else 2,
			"zone": ZoneType.DECK
		}
		cards[card_id] = card_data
		zones[ZoneType.DECK].append(card_id)

func add_card_to_zone(card_id: String, zone: ZoneType) -> bool:
	"""Add a card to a specific zone"""
	if not cards.has(card_id):
		print("Error: Card " + card_id + " not found")
		return false
		
	var old_zone = cards[card_id].get("zone", ZoneType.DECK)
	
	# Remove from old zone
	if zones[old_zone].has(card_id):
		zones[old_zone].erase(card_id)
	
	# Add to new zone
	zones[zone].append(card_id)
	cards[card_id]["zone"] = zone
	
	zone_changed.emit(card_id, ZoneType.keys()[old_zone], ZoneType.keys()[zone])
	game_state_updated.emit()
	
	return true

func remove_card_from_zone(card_id: String, zone: ZoneType) -> bool:
	"""Remove a card from a specific zone"""
	if not zones[zone].has(card_id):
		return false
		
	zones[zone].erase(card_id)
	card_removed.emit(card_id, ZoneType.keys()[zone])
	game_state_updated.emit()
	
	return true

func move_card(card_id: String, from_zone: ZoneType, to_zone: ZoneType) -> bool:
	"""Move a card between zones with validation"""
	if not zones[from_zone].has(card_id):
		print("Error: Card not in source zone")
		return false
		
	remove_card_from_zone(card_id, from_zone)
	add_card_to_zone(card_id, to_zone)
	
	return true

func get_cards_in_zone(zone: ZoneType) -> Array:
	"""Get all card IDs in a specific zone"""
	return zones[zone].duplicate()

func get_card_data(card_id: String) -> Dictionary:
	"""Get card data by ID"""
	return cards.get(card_id, {})

func next_turn():
	"""Advance to the next turn"""
	current_player = 2 if current_player == 1 else 1
	if current_player == 1:
		turn_count += 1
	
	turn_changed.emit(current_player, turn_count)
	game_state_updated.emit()

func get_zone_name(zone: ZoneType) -> String:
	"""Convert zone enum to readable name"""
	match zone:
		ZoneType.FLAG:
			return "FLAG"
		ZoneType.LIFE:
			return "LIFE"
		ZoneType.COMBAT_ROW:
			return "Combat Row"
		ZoneType.FIELD:
			return "Field"
		ZoneType.DECK:
			return "Deck"
		ZoneType.REMOVED_FROM_PLAY:
			return "Removed From Play"
		ZoneType.AZOTH_ROW:
			return "Azoth Row"
		_:
			return "Unknown"

func update_player_life(player: int, new_life: int):
	"""Update player life total"""
	if players.has(player):
		players[player]["life"] = new_life
		game_state_updated.emit()

func update_player_azoth(player: int, new_azoth: int):
	"""Update player azoth total"""
	if players.has(player):
		players[player]["azoth"] = new_azoth
		game_state_updated.emit()

func get_player_data(player: int) -> Dictionary:
	"""Get player data by ID"""
	return players.get(player, {})