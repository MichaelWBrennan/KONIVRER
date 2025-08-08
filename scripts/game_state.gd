# game_state.gd
extends Node

# Simple authoritative state kept here so board and cards stay decoupled.
# Expand with card models, owner ids, turn info, etc.

var zones : Dictionary = {
	"FLAG": [],
	"LIFE": [],
	"CombatRow": [],
	"Field": [],
	"DECK": [],
	"RemovedFromPlay": [],
	"AzothRow": []
}

signal zone_changed(zone_name: String, contents: Array)

func add_card_to_zone(card_id: String, zone_name: String) -> void:
	if not zones.has(zone_name):
		return
	if card_id in zones[zone_name]:
		return
	for k in zones.keys():
		if card_id in zones[k]:
			zones[k].erase(card_id)
	zones[zone_name].append(card_id)
	emit_signal("zone_changed", zone_name, zones[zone_name].duplicate())

func remove_card_from_zone(card_id: String) -> void:
	for k in zones.keys():
		if card_id in zones[k]:
			zones[k].erase(card_id)
			emit_signal("zone_changed", k, zones[k].duplicate())
			return
