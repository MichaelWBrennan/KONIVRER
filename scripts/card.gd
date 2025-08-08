# card.gd
extends Panel

signal drag_started(card)
signal drag_ended(card, global_pos)
signal double_clicked(card)

# metadata
var card_id : String = ""
func get_card_id() -> String:
	return card_id if card_id != "" else name

# drag state
var _dragging := false
var _drag_offset := Vector2.ZERO
var _origin_parent : Node = null
var _origin_pos : Vector2 = Vector2.ZERO
var _picked_scale := Vector2(1.08, 1.08)
var _picked_elev := -16

# double-click tracking
var _last_click_time := 0.0
const DOUBLE_CLICK_MAX := 0.35

func _ready():
	set_process_input(true)
	# ensure control receives mouse events
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND

func _gui_input(event):
	# Left button press: begin drag
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			# double click detection
			var now = OS.get_ticks_msec() / 1000.0
			if now - _last_click_time <= DOUBLE_CLICK_MAX:
				emit_signal("double_clicked", self)
				_last_click_time = 0
				return
			_last_click_time = now

			_dragging = true
			_origin_parent = get_parent()
			_origin_pos = position
			_drag_offset = get_global_mouse_position() - get_global_position()
			# lift & scale
			_apply_pickup_animation()
			emit_signal("drag_started", self)
			get_tree().set_input_as_handled()
		elif event.button_index == MOUSE_BUTTON_LEFT and not event.pressed:
			if _dragging:
				_dragging = false
				# tell board to place card
				var board = get_tree().get_root().get_node_or_null("root/Board")
				if board == null:
					# attempt relative lookup (if running scene directly)
					board = find_parent_board()
				var global_pos = get_global_mouse_position()
				emit_signal("drag_ended", self, global_pos)
				if board:
					board.place_card_in_zone(self, global_pos)
				else:
					return_to_origin()
				_apply_putdown_animation()
				get_tree().set_input_as_handled()
		# Right click context: placeholder
		if event.button_index == MOUSE_BUTTON_RIGHT and event.pressed:
			_show_context_menu()

	if event is InputEventMouseMotion and _dragging:
		global_position = get_global_mouse_position() - _drag_offset

func _apply_pickup_animation():
	# animate scale & slight elevation
	self.raise_()
	var tween = get_tree().create_tween()
	tween.tween_property(self, "scale", _picked_scale, 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate", Color(1,1,1,1), 0.12)
	# subtle elevation by shifting y
	tween.tween_property(self, "position", self.position + Vector2(0, _picked_elev), 0.12)

func _apply_putdown_animation():
	# small settle animation - controlled in board when snapping; this is fallback
	var tween = get_tree().create_tween()
	tween.tween_property(self, "scale", Vector2(1,1), 0.12).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func return_to_origin():
	# Reparent back if needed and tween to origin pos
	if get_parent() != _origin_parent:
		get_parent().remove_child(self)
		_origin_parent.add_child(self)
	var tween = get_tree().create_tween()
	tween.tween_property(self, "position", _origin_pos, 0.18).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", Vector2(1,1), 0.12)

func _show_context_menu():
	# placeholder context menu - implement actions you need
	print("Context menu for card:", get_card_id())

func find_parent_board():
	var p = get_parent()
	while p:
		if p.name == "Board":
			return p
		p = p.get_parent()
	return null

# Optional: detect double-click externally (board listens to double_clicked)
func _on_double_click():
	# Auto-play to default zone: CombatRow
	var board = find_parent_board()
	if board:
		board.place_card_in_zone(self, rect_global_position + rect_size * 0.5)
