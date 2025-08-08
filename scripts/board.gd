# board.gd
extends Control

@onready var zones = {
	"FLAG": $FLAG,
	"LIFE": $LIFE,
	"CombatRow": $CombatRow,
	"Field": $Field,
	"DECK": $DECK,
	"RemovedFromPlay": $RemovedFromPlay,
	"AzothRow": $AzothRow
}

# Tweener
var tweener: SceneTreeTween = null
# When dragging, this tracks the current candidate zone for visual highlight
var _hover_zone: String = ""
# Per-zone stacking offsets (for Stack like visuals)
var stack_offsets = {
	"StackZone": Vector2(12, 8)
}

func _ready():
	# Connect enter/exit for each zone for hover highlight
	for zone_name in zones.keys():
		var zone_node = zones[zone_name]
		# Ensure mouse pass-through so Control receives mouse_entered/exited
		zone_node.mouse_filter = Control.MOUSE_FILTER_PASS
		zone_node.connect("mouse_entered", Callable(self, "_on_zone_mouse_entered").bind(zone_name))
		zone_node.connect("mouse_exited", Callable(self, "_on_zone_mouse_exited").bind(zone_name))
	# Hook game state - optional but useful
	if Engine.has_singleton("GameState"):
		GameState.connect("zone_changed", Callable(self, "_on_zone_changed"))

func _on_zone_mouse_entered(zone_name: String):
	_hover_zone = zone_name
	_highlight_zone(zone_name, true)

func _on_zone_mouse_exited(zone_name: String):
	_hover_zone = ""
	_highlight_zone(zone_name, false)

func _highlight_zone(zone_name: String, on: bool) -> void:
	if not zones.has(zone_name):
		return
	var z = zones[zone_name]
	# Animate modulate (subtle) so it's GPU friendly
	var start = z.modulate
	var target = Color(0.85, 0.95, 1.0, 1.0) if on else Color(1,1,1,1)
	# Use SceneTreeTween for smoothness
	var tween = get_tree().create_tween()
	tween.tween_property(z, "modulate", target, 0.15).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)

# Called by Card on release to place it into a zone
func place_card_in_zone(card: Node, global_drop_pos: Vector2) -> void:
	var target_zone_name = _zone_from_global_position(global_drop_pos)
	if target_zone_name == "":
		# no zone found => return to card's origin
		card.call_deferred("return_to_origin")
		return

	# compute snap position inside the zone:
	var snap_local = _snap_position_for_zone(target_zone_name, card)
	# reparent card to zone so its local coords are consistent
	var prev_parent = card.get_parent()
	if prev_parent != zones[target_zone_name]:
		card.get_parent().remove_child(card)
		zones[target_zone_name].add_child(card)
	# Tween to the target local position
	if tweener:
		tweener.kill()
	tweener = get_tree().create_tween()
	# card global -> do local tween for smooth visual on reparent
	var current_pos = card.position
	tweener.tween_property(card, "position", snap_local, 0.20).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	# small scale/settle pop
	tweener.tween_property(card, "scale", Vector2(1,1), 0.12).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	# Update GameState (use id if present, else name)
	var id = card.has_method("get_card_id") ? card.get_card_id() : card.name
	if Engine.has_singleton("GameState"):
		GameState.add_card_to_zone(id, target_zone_name)

func _zone_from_global_position(global_pos: Vector2) -> String:
	# iterate zones, use rect_global_position/rect_size to test
	for zone_name in zones.keys():
		var z = zones[zone_name]
		var rpos = z.get_global_position()
		var rsize = z.rect_size
		var rect = Rect2(rpos, rsize)
		if rect.has_point(global_pos):
			return zone_name
	return ""

func _snap_position_for_zone(zone_name: String, card: Node) -> Vector2:
	# Basic behavior: center the card in the zone.
	# For battlefield-style behavior extend this to compute per-slot centers.
	var z = zones[zone_name]
	var local_center = z.rect_size * 0.5
	# For stack-like zones we offset by size of existing children
	if zone_name == "StackZone" or zone_name == "RemovedFromPlay":
		var offset = Vector2(0, -12) * z.get_child_count()
		return local_center + offset
	# ensure card fits in zone bounds (basic clamp)
	var margin = Vector2(10, 10)
	local_center.x = clamp(local_center.x, margin.x, z.rect_size.x - margin.x)
	local_center.y = clamp(local_center.y, margin.y, z.rect_size.y - margin.y)
	return local_center

# Called when GameState updates externally (useful for syncing remote play)
func _on_zone_changed(zone_name: String, contents: Array) -> void:
	# Minimal sample: print. Implement full sync as needed by your networking layer.
	print("GameState zone changed:", zone_name, contents)
