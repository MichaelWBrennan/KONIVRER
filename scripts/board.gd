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

func _ready():
	for zone_name in zones.keys():
		var zone_node = zones[zone_name]
		zone_node.connect("gui_input", Callable(self, "_on_zone_input").bind(zone_name))

func _on_zone_input(event: InputEvent, zone_name: String):
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		print("Clicked in zone: ", zone_name)

func move_card_to_zone(card: Node, zone_name: String):
	if zone_name in zones:
		card.get_parent().remove_child(card)
		zones[zone_name].add_child(card)
		card.position = Vector2.ZERO
		print("Moved card to zone: ", zone_name)
