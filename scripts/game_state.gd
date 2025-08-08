extends Node

# MTG Arena GameState singleton - handles all game state management
# Complete state tracking for Magic: The Gathering Arena replica

signal zone_changed(card_id: String, from_zone: String, to_zone: String)
signal card_played(card_id: String, zone: String) 
signal card_removed(card_id: String, zone: String)
signal turn_changed(player: int, turn_count: int)
signal phase_changed(phase: String)
signal priority_changed(player: int)
signal game_state_updated()

# MTG game state variables
var current_turn: int = 1
var current_player: int = 1
var turn_count: int = 1
var current_phase: String = "Main Phase 1"
var has_priority: int = 1
var game_active: bool = true

# MTG phases in order
var mtg_phases: Array[String] = [
	"Untap Step",
	"Upkeep Step", 
	"Draw Step",
	"Main Phase 1",
	"Beginning of Combat",
	"Declare Attackers",
	"Declare Blockers", 
	"Combat Damage",
	"End of Combat",
	"Main Phase 2",
	"End Step",
	"Cleanup Step"
]

var current_phase_index: int = 3  # Start at Main Phase 1

# MTG Arena zone definitions 
enum ZoneType {
	PLAYER_BATTLEFIELD,
	OPPONENT_BATTLEFIELD,
	PLAYER_HAND,
	OPPONENT_HAND,
	PLAYER_LIBRARY,
	OPPONENT_LIBRARY,
	PLAYER_GRAVEYARD,
	OPPONENT_GRAVEYARD,
	PLAYER_MANA,
	OPPONENT_MANA,
	STACK,
	EXILE
}

# Zone containers - each zone holds array of card IDs
var zones: Dictionary = {}

# Card registry - tracks all MTG cards and their properties
var cards: Dictionary = {}

# Player data in MTG Arena format
var players: Dictionary = {
	1: {
		"name": "Player",
		"life": 20,
		"mana": {"white": 0, "blue": 0, "black": 0, "red": 0, "green": 0, "colorless": 0},
		"max_mana": {"white": 0, "blue": 0, "black": 0, "red": 0, "green": 0, "colorless": 0},
		"lands_played": 0,
		"max_lands_per_turn": 1
	},
	2: {
		"name": "Opponent", 
		"life": 20,
		"mana": {"white": 0, "blue": 0, "black": 0, "red": 0, "green": 0, "colorless": 0},
		"max_mana": {"white": 0, "blue": 0, "black": 0, "red": 0, "green": 0, "colorless": 0},
		"lands_played": 0,
		"max_lands_per_turn": 1
	}
}

# Stack for spells and abilities
var stack: Array = []

func _ready():
	print("MTG Arena GameState initialized")
	_initialize_zones()
	_initialize_demo_cards()
	_setup_starting_hands()

func _initialize_zones():
	"""Initialize all MTG Arena zones"""
	for zone_type in ZoneType.values():
		zones[zone_type] = []

func _initialize_demo_cards():
	"""Initialize demo MTG-style cards"""
	# Demo creatures
	var creature_names = ["Lightning Bolt", "Counterspell", "Giant Growth", "Healing Salve", 
						  "Dark Ritual", "Llanowar Elves", "Serra Angel", "Shivan Dragon"]
	
	for i in range(20):
		var card_id = "card_" + str(i)
		var name_index = i % creature_names.size()
		
		var card_data = {
			"id": card_id,
			"name": creature_names[name_index],
			"mana_cost": randi_range(1, 6),
			"type": "Creature" if i % 3 == 0 else "Instant",
			"power": randi_range(1, 8) if i % 3 == 0 else 0,
			"toughness": randi_range(1, 8) if i % 3 == 0 else 0,
			"owner": 1 if i < 10 else 2,
			"zone": ZoneType.PLAYER_LIBRARY if i < 10 else ZoneType.OPPONENT_LIBRARY,
			"tapped": false,
			"summoning_sick": false
		}
		cards[card_id] = card_data
		
		if i < 10:
			zones[ZoneType.PLAYER_LIBRARY].append(card_id)
		else:
			zones[ZoneType.OPPONENT_LIBRARY].append(card_id)
	
	# Shuffle libraries
	zones[ZoneType.PLAYER_LIBRARY].shuffle()
	zones[ZoneType.OPPONENT_LIBRARY].shuffle()

func _setup_starting_hands():
	"""Draw starting hands like MTG Arena"""
	# Draw 7 cards for each player
	for i in range(7):
		draw_card(1)
		draw_card(2)

func draw_card(player: int) -> String:
	"""Draw a card from library to hand"""
	var library_zone = ZoneType.PLAYER_LIBRARY if player == 1 else ZoneType.OPPONENT_LIBRARY  
	var hand_zone = ZoneType.PLAYER_HAND if player == 1 else ZoneType.OPPONENT_HAND
	
	if zones[library_zone].is_empty():
		print("Player " + str(player) + " tries to draw from empty library!")
		return ""
	
	var card_id = zones[library_zone].pop_front()
	zones[hand_zone].append(card_id)
	cards[card_id]["zone"] = hand_zone
	
	zone_changed.emit(card_id, get_zone_name(library_zone), get_zone_name(hand_zone))
	game_state_updated.emit()
	
	return card_id

func add_card_to_zone(card_id: String, zone: ZoneType) -> bool:
	"""Add a card to a specific zone"""
	if not cards.has(card_id):
		print("Error: Card " + card_id + " not found")
		return false
		
	var old_zone = cards[card_id].get("zone", ZoneType.PLAYER_LIBRARY)
	
	# Remove from old zone
	if zones.has(old_zone) and zones[old_zone].has(card_id):
		zones[old_zone].erase(card_id)
	
	# Add to new zone
	zones[zone].append(card_id)
	cards[card_id]["zone"] = zone
	
	zone_changed.emit(card_id, get_zone_name(old_zone), get_zone_name(zone))
	game_state_updated.emit()
	
	return true

func move_card(card_id: String, from_zone: ZoneType, to_zone: ZoneType) -> bool:
	"""Move a card between zones with MTG rules validation"""
	if not zones[from_zone].has(card_id):
		print("Error: Card not in source zone")
		return false
	
	# MTG zone change rules
	if to_zone == ZoneType.PLAYER_BATTLEFIELD or to_zone == ZoneType.OPPONENT_BATTLEFIELD:
		cards[card_id]["summoning_sick"] = true
		cards[card_id]["tapped"] = false
	
	zones[from_zone].erase(card_id)
	add_card_to_zone(card_id, to_zone)
	
	return true

func next_turn():
	"""Advance to next turn with full MTG turn structure"""
	if current_player == 1:
		current_player = 2
	else:
		current_player = 1
		turn_count += 1
	
	# Reset to untap step
	current_phase_index = 0
	current_phase = mtg_phases[0]
	has_priority = current_player
	
	# Reset lands played for active player
	players[current_player]["lands_played"] = 0
	
	# Untap all permanents for active player
	_untap_permanents(current_player)
	
	# Draw a card for active player (except first turn)
	if turn_count > 1 or current_player == 2:
		draw_card(current_player)
	
	turn_changed.emit(current_player, turn_count)
	phase_changed.emit(current_phase)
	priority_changed.emit(has_priority)
	game_state_updated.emit()

func next_phase():
	"""Advance to next phase in turn"""
	current_phase_index += 1
	
	if current_phase_index >= mtg_phases.size():
		# End of turn, go to next player
		next_turn()
		return
	
	current_phase = mtg_phases[current_phase_index]
	has_priority = current_player
	
	phase_changed.emit(current_phase)
	priority_changed.emit(has_priority)
	game_state_updated.emit()

func pass_priority():
	"""Pass priority to other player"""
	has_priority = 2 if has_priority == 1 else 1
	priority_changed.emit(has_priority)

func _untap_permanents(player: int):
	"""Untap all tapped permanents controlled by player"""
	var battlefield_zone = ZoneType.PLAYER_BATTLEFIELD if player == 1 else ZoneType.OPPONENT_BATTLEFIELD
	
	for card_id in zones[battlefield_zone]:
		if cards.has(card_id):
			cards[card_id]["tapped"] = false
			cards[card_id]["summoning_sick"] = false

func get_cards_in_zone(zone: ZoneType) -> Array:
	"""Get all card IDs in a specific zone"""
	return zones.get(zone, []).duplicate()

func get_card_data(card_id: String) -> Dictionary:
	"""Get card data by ID"""
	return cards.get(card_id, {})

func get_zone_name(zone: ZoneType) -> String:
	"""Convert zone enum to readable name"""
	match zone:
		ZoneType.PLAYER_BATTLEFIELD:
			return "Player Battlefield"
		ZoneType.OPPONENT_BATTLEFIELD:
			return "Opponent Battlefield"
		ZoneType.PLAYER_HAND:
			return "Player Hand"
		ZoneType.OPPONENT_HAND:
			return "Opponent Hand"
		ZoneType.PLAYER_LIBRARY:
			return "Player Library"
		ZoneType.OPPONENT_LIBRARY:
			return "Opponent Library"
		ZoneType.PLAYER_GRAVEYARD:
			return "Player Graveyard"
		ZoneType.OPPONENT_GRAVEYARD:
			return "Opponent Graveyard"
		ZoneType.PLAYER_MANA:
			return "Player Mana"
		ZoneType.OPPONENT_MANA:
			return "Opponent Mana"
		ZoneType.STACK:
			return "Stack"
		ZoneType.EXILE:
			return "Exile"
		_:
			return "Unknown"

func update_player_life(player: int, new_life: int):
	"""Update player life total"""
	if players.has(player):
		players[player]["life"] = new_life
		
		# Check for game end
		if new_life <= 0:
			_end_game(player)
		
		game_state_updated.emit()

func tap_card(card_id: String) -> bool:
	"""Tap a card (MTG mechanic)"""
	if cards.has(card_id):
		cards[card_id]["tapped"] = true
		game_state_updated.emit()
		return true
	return false

func untap_card(card_id: String) -> bool:
	"""Untap a card"""
	if cards.has(card_id):
		cards[card_id]["tapped"] = false
		game_state_updated.emit()
		return true
	return false

func add_mana(player: int, mana_type: String, amount: int):
	"""Add mana to player's mana pool"""
	if players.has(player) and players[player]["mana"].has(mana_type):
		players[player]["mana"][mana_type] += amount
		game_state_updated.emit()

func spend_mana(player: int, mana_type: String, amount: int) -> bool:
	"""Spend mana from player's pool"""
	if players.has(player) and players[player]["mana"].has(mana_type):
		if players[player]["mana"][mana_type] >= amount:
			players[player]["mana"][mana_type] -= amount
			game_state_updated.emit()
			return true
	return false

func _end_game(losing_player: int):
	"""End the game"""
	game_active = false
	var winner = 1 if losing_player == 2 else 2
	print("Game Over! Player " + str(winner) + " wins!")

func get_player_data(player: int) -> Dictionary:
	"""Get player data by ID"""
	return players.get(player, {})
