extends Node

# KONIVRER GameState singleton - handles all game state management
# Complete state tracking for KONIVRER card game

signal zone_changed(card_id: String, from_zone: String, to_zone: String)
signal card_played(card_id: String, zone: String) 
signal card_removed(card_id: String, zone: String)
signal turn_changed(player: int, turn_count: int)
signal phase_changed(phase: String)
signal priority_changed(player: int)
signal game_state_updated()
signal life_card_damage(player: int, damage: int)
signal azoth_generated(player: int, element: String, amount: int)

# KONIVRER game state variables
var current_turn: int = 1
var current_player: int = 1
var turn_count: int = 1
var current_phase: String = "Start Phase"
var has_priority: int = 1
var game_active: bool = true

# KONIVRER phases in order
var konivr_phases: Array[String] = [
	"Start Phase",        # Draw 2 cards (first turn), place Azoth
	"Main Phase",         # Play cards, resolve keywords
	"Combat Phase",       # Attack with Familiars
	"Post-Combat Main",   # Play additional cards
	"Refresh Phase"       # Refresh Azoth sources
]

var current_phase_index: int = 0  # Start at Start Phase

# KONIVRER zone definitions 
enum ZoneType {
	PLAYER_FIELD,           # Main battlefield for Familiars
	OPPONENT_FIELD,
	PLAYER_COMBAT_ROW,      # Combat area for battles
	OPPONENT_COMBAT_ROW,
	PLAYER_AZOTH_ROW,       # Resource area for Azoth generation
	OPPONENT_AZOTH_ROW,
	PLAYER_HAND,
	OPPONENT_HAND,
	PLAYER_DECK,            # 40-card deck
	OPPONENT_DECK,
	PLAYER_LIFE_CARDS,      # 4 life cards for damage tracking
	OPPONENT_LIFE_CARDS,
	PLAYER_FLAG,            # Single flag card (deck identity)
	OPPONENT_FLAG,
	REMOVED_FROM_PLAY       # Void zone for removed cards
}

# Zone containers - each zone holds array of card IDs
var zones: Dictionary = {}

# Card registry - tracks all MTG cards and their properties
var cards: Dictionary = {}

# Player data in KONIVRER format
var players: Dictionary = {
	1: {
		"name": "Player",
		"life_cards_remaining": 4,  # KONIVRER: Track life cards instead of life total
		"azoth": {"fire": 0, "water": 0, "earth": 0, "air": 0, "aether": 0, "nether": 0, "generic": 0},
		"counters": {},  # +1 counters on cards
		"flag_element": "",  # Element from flag card
	},
	2: {
		"name": "Opponent", 
		"life_cards_remaining": 4,
		"azoth": {"fire": 0, "water": 0, "earth": 0, "air": 0, "aether": 0, "nether": 0, "generic": 0},
		"counters": {},
		"flag_element": "",
	}
}

# Stack for spells and abilities
var stack: Array = []

func _ready():
	print("KONIVRER GameState initialized")
	_initialize_zones()
	_initialize_demo_cards()
	_setup_starting_game()

func _initialize_zones():
	"""Initialize all KONIVRER zones"""
	for zone_type in ZoneType.values():
		zones[zone_type] = []

func _initialize_demo_cards():
	"""Initialize demo KONIVRER-style cards"""
	# Demo Familiars and Spells with KONIVRER elements
	var card_names = ["Fire Familiar", "Water Guardian", "Earth Sentinel", "Air Spirit", 
					  "Aether Mage", "Nether Shade", "Brilliant Strike", "Gust Wind"]
	var elements = ["🜂", "🜄", "🜃", "🜁", "⭘", "▢", "⭘", "🜁"]
	var keywords = [[], [], ["Steadfast"], ["Gust"], ["Brilliance"], ["Void"], ["Brilliance"], ["Gust"]]
	
	for i in range(20):  # 20 cards per deck (instead of full 40 for demo)
		var card_id = "card_" + str(i)
		var name_index = i % card_names.size()
		
		var card_data = {
			"id": card_id,
			"name": card_names[name_index],
			"element": elements[name_index],
			"cost": randi_range(1, 4),  # Lower costs for KONIVRER
			"type": "Familiar" if i % 3 == 0 else "Spell",
			"strength": randi_range(1, 6),  # KONIVRER uses strength instead of power/toughness
			"base_strength": randi_range(1, 6),
			"keywords": keywords[name_index],
			"owner": 1 if i < 10 else 2,
			"zone": ZoneType.PLAYER_DECK if i < 10 else ZoneType.OPPONENT_DECK,
			"tapped": false,
			"plus_one_counters": 0,
		}
		cards[card_id] = card_data
		
		if i < 10:
			zones[ZoneType.PLAYER_DECK].append(card_id)
		else:
			zones[ZoneType.OPPONENT_DECK].append(card_id)
	
	# Shuffle decks
	zones[ZoneType.PLAYER_DECK].shuffle()
	zones[ZoneType.OPPONENT_DECK].shuffle()

func _setup_starting_game():
	"""Setup KONIVRER starting game state"""
	# KONIVRER: Create 4 life cards from top of deck
	for i in range(4):
		if not zones[ZoneType.PLAYER_DECK].is_empty():
			var card_id = zones[ZoneType.PLAYER_DECK].pop_front()
			zones[ZoneType.PLAYER_LIFE_CARDS].append(card_id)
			cards[card_id]["zone"] = ZoneType.PLAYER_LIFE_CARDS
		
		if not zones[ZoneType.OPPONENT_DECK].is_empty():
			var card_id = zones[ZoneType.OPPONENT_DECK].pop_front()
			zones[ZoneType.OPPONENT_LIFE_CARDS].append(card_id)
			cards[card_id]["zone"] = ZoneType.OPPONENT_LIFE_CARDS
	
	# KONIVRER: Start with empty hands (draw 2 on first turn)
	print("Game setup complete - KONIVRER rules active")

func draw_card(player: int, count: int = 1) -> Array:
	"""Draw cards from deck to hand - KONIVRER style"""
	var deck_zone = ZoneType.PLAYER_DECK if player == 1 else ZoneType.OPPONENT_DECK  
	var hand_zone = ZoneType.PLAYER_HAND if player == 1 else ZoneType.OPPONENT_HAND
	var drawn_cards = []
	
	for i in range(count):
		if zones[deck_zone].is_empty():
			print("Player " + str(player) + " tries to draw from empty deck!")
			break
		
		var card_id = zones[deck_zone].pop_front()
		zones[hand_zone].append(card_id)
		cards[card_id]["zone"] = hand_zone
		drawn_cards.append(card_id)
		
		zone_changed.emit(card_id, get_zone_name(deck_zone), get_zone_name(hand_zone))
	
	game_state_updated.emit()
	return drawn_cards

func deal_life_card_damage(player: int, damage: int):
	"""KONIVRER: Deal damage by removing life cards"""
	var life_cards_zone = ZoneType.PLAYER_LIFE_CARDS if player == 1 else ZoneType.OPPONENT_LIFE_CARDS
	var cards_to_remove = min(damage, zones[life_cards_zone].size())
	
	for i in range(cards_to_remove):
		if not zones[life_cards_zone].is_empty():
			var card_id = zones[life_cards_zone].pop_back()
			
			# KONIVRER: Check for Burst ability when card is drawn from life cards
			if cards[card_id].has("keywords") and "Burst" in cards[card_id]["keywords"]:
				# Burst can be played for free
				life_card_damage.emit(player, 1)
				print("Burst card revealed: " + cards[card_id]["name"])
				# Add to hand for potential burst play
				var hand_zone = ZoneType.PLAYER_HAND if player == 1 else ZoneType.OPPONENT_HAND
				zones[hand_zone].append(card_id)
				cards[card_id]["zone"] = hand_zone
			else:
				# Move to removed from play
				zones[ZoneType.REMOVED_FROM_PLAY].append(card_id)
				cards[card_id]["zone"] = ZoneType.REMOVED_FROM_PLAY
	
	# Update life card count
	players[player]["life_cards_remaining"] = zones[life_cards_zone].size()
	
	life_card_damage.emit(player, cards_to_remove)
	game_state_updated.emit()

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
	"""Advance to next turn with KONIVRER turn structure"""
	if current_player == 1:
		current_player = 2
	else:
		current_player = 1
		turn_count += 1
	
	# Reset to start phase
	current_phase_index = 0
	current_phase = konivr_phases[0]
	has_priority = current_player
	
	# KONIVRER: Draw 2 cards on first turn only
	if turn_count == 1:
		draw_card(current_player, 2)
	
	# Refresh Azoth sources (untap them)
	_refresh_azoth_sources(current_player)
	
	turn_changed.emit(current_player, turn_count)
	phase_changed.emit(current_phase)
	priority_changed.emit(has_priority)
	game_state_updated.emit()

func next_phase():
	"""Advance to next phase in KONIVRER turn"""
	current_phase_index += 1
	
	if current_phase_index >= konivr_phases.size():
		# End of turn, go to next player
		next_turn()
		return
	
	current_phase = konivr_phases[current_phase_index]
	has_priority = current_player
	
	# Execute phase-specific actions
	match current_phase:
		"Start Phase":
			_execute_start_phase()
		"Main Phase":
			_execute_main_phase()
		"Combat Phase":
			_execute_combat_phase()
		"Post-Combat Main":
			_execute_post_combat_main()
		"Refresh Phase":
			_execute_refresh_phase()
	
	phase_changed.emit(current_phase)
	priority_changed.emit(has_priority)
	game_state_updated.emit()

func _refresh_azoth_sources(player: int):
	"""KONIVRER: Refresh (untap) Azoth sources and generate Azoth"""
	var azoth_zone = ZoneType.PLAYER_AZOTH_ROW if player == 1 else ZoneType.OPPONENT_AZOTH_ROW
	
	players[player]["azoth"] = {"fire": 0, "water": 0, "earth": 0, "air": 0, "aether": 0, "nether": 0, "generic": 0}
	
	for card_id in zones[azoth_zone]:
		if cards.has(card_id):
			cards[card_id]["tapped"] = false
			var element = cards[card_id].get("element", "generic")
			var element_key = _get_element_key(element)
			if players[player]["azoth"].has(element_key):
				players[player]["azoth"][element_key] += 1
				azoth_generated.emit(player, element_key, 1)

func _get_element_key(element_symbol: String) -> String:
	"""Convert KONIVRER element symbols to keys"""
	match element_symbol:
		"🜂": return "fire"
		"🜄": return "water"
		"🜃": return "earth"
		"🜁": return "air"
		"⭘": return "aether"
		"▢": return "nether"
		_: return "generic"

func play_card_as_summon(card_id: String, azoth_paid: Dictionary) -> bool:
	"""KONIVRER: Play card as Familiar with +1 counters"""
	if not cards.has(card_id):
		return false
	
	var player = cards[card_id]["owner"]
	var field_zone = ZoneType.PLAYER_FIELD if player == 1 else ZoneType.OPPONENT_FIELD
	var hand_zone = ZoneType.PLAYER_HAND if player == 1 else ZoneType.OPPONENT_HAND
	
	# Remove from hand
	zones[hand_zone].erase(card_id)
	
	# Add to field with +1 counters = generic azoth paid
	zones[field_zone].append(card_id)
	cards[card_id]["zone"] = field_zone
	cards[card_id]["plus_one_counters"] = azoth_paid.get("generic", 0)
	
	return true

func play_card_as_spell(card_id: String) -> bool:
	"""KONIVRER: Play card as Spell, then put on bottom of deck"""
	if not cards.has(card_id):
		return false
	
	var player = cards[card_id]["owner"]
	var deck_zone = ZoneType.PLAYER_DECK if player == 1 else ZoneType.OPPONENT_DECK
	var hand_zone = ZoneType.PLAYER_HAND if player == 1 else ZoneType.OPPONENT_HAND
	
	# Remove from hand
	zones[hand_zone].erase(card_id)
	
	# Resolve spell effect (simplified)
	print("Resolving spell: " + cards[card_id]["name"])
	
	# Put on bottom of deck
	zones[deck_zone].append(card_id)
	cards[card_id]["zone"] = deck_zone
	
	return true

func play_card_as_azoth(card_id: String) -> bool:
	"""KONIVRER: Place card in Azoth Row as resource"""
	if not cards.has(card_id):
		return false
	
	var player = cards[card_id]["owner"]
	var azoth_zone = ZoneType.PLAYER_AZOTH_ROW if player == 1 else ZoneType.OPPONENT_AZOTH_ROW
	var hand_zone = ZoneType.PLAYER_HAND if player == 1 else ZoneType.OPPONENT_HAND
	
	# Remove from hand
	zones[hand_zone].erase(card_id)
	
	# Add to Azoth Row
	zones[azoth_zone].append(card_id)
	cards[card_id]["zone"] = azoth_zone
	
	return true

func _execute_start_phase():
	"""KONIVRER Start Phase: Draw 2 cards (first turn), place Azoth"""
	print("Executing Start Phase for Player " + str(current_player))

func _execute_main_phase():
	"""KONIVRER Main Phase: Play cards, resolve keywords"""
	print("Executing Main Phase for Player " + str(current_player))

func _execute_combat_phase():
	"""KONIVRER Combat Phase: Attack with Familiars"""
	print("Executing Combat Phase for Player " + str(current_player))

func _execute_post_combat_main():
	"""KONIVRER Post-Combat Main: Play additional cards"""
	print("Executing Post-Combat Main Phase for Player " + str(current_player))

func _execute_refresh_phase():
	"""KONIVRER Refresh Phase: Refresh Azoth sources"""
	_refresh_azoth_sources(current_player)
	print("Executing Refresh Phase for Player " + str(current_player))

func get_cards_in_zone(zone: ZoneType) -> Array:
	"""Get all card IDs in a specific zone"""
	return zones.get(zone, []).duplicate()

func get_card_data(card_id: String) -> Dictionary:
	"""Get card data by ID"""
	return cards.get(card_id, {})

func get_zone_name(zone: ZoneType) -> String:
	"""Convert zone enum to readable name"""
	match zone:
		ZoneType.PLAYER_FIELD:
			return "Player Field"
		ZoneType.OPPONENT_FIELD:
			return "Opponent Field"
		ZoneType.PLAYER_COMBAT_ROW:
			return "Player Combat Row"
		ZoneType.OPPONENT_COMBAT_ROW:
			return "Opponent Combat Row"
		ZoneType.PLAYER_AZOTH_ROW:
			return "Player Azoth Row"
		ZoneType.OPPONENT_AZOTH_ROW:
			return "Opponent Azoth Row"
		ZoneType.PLAYER_HAND:
			return "Player Hand"
		ZoneType.OPPONENT_HAND:
			return "Opponent Hand"
		ZoneType.PLAYER_DECK:
			return "Player Deck"
		ZoneType.OPPONENT_DECK:
			return "Opponent Deck"
		ZoneType.PLAYER_LIFE_CARDS:
			return "Player Life Cards"
		ZoneType.OPPONENT_LIFE_CARDS:
			return "Opponent Life Cards"
		ZoneType.PLAYER_FLAG:
			return "Player Flag"
		ZoneType.OPPONENT_FLAG:
			return "Opponent Flag"
		ZoneType.REMOVED_FROM_PLAY:
			return "Removed from Play"
		_:
			return "Unknown"

func update_player_life_cards(player: int, new_count: int):
	"""Update player life card count"""
	if players.has(player):
		players[player]["life_cards_remaining"] = new_count
		
		# Check for game end
		if new_count <= 0:
			_end_game(player)
		
		game_state_updated.emit()

func pass_priority():
	"""Pass priority to other player"""
	has_priority = 2 if has_priority == 1 else 1
	priority_changed.emit(has_priority)

func tap_card(card_id: String) -> bool:
	"""Tap a card (KONIVRER mechanic)"""
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

func add_azoth(player: int, element: String, amount: int):
	"""Add Azoth to player's pool"""
	var element_key = _get_element_key(element)
	if players.has(player) and players[player]["azoth"].has(element_key):
		players[player]["azoth"][element_key] += amount
		azoth_generated.emit(player, element_key, amount)
		game_state_updated.emit()

func spend_azoth(player: int, element: String, amount: int) -> bool:
	"""Spend Azoth from player's pool"""
	var element_key = _get_element_key(element)
	if players.has(player) and players[player]["azoth"].has(element_key):
		if players[player]["azoth"][element_key] >= amount:
			players[player]["azoth"][element_key] -= amount
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
