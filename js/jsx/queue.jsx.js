/* global

    $r,
    WQueue: writable,
    game
*/

WQueue = React.createClass({

    getInitialState: function(){
        return {
            typeId: "buildings",
            itemId: null,
            itemLabel: null,
            game: this.props.game
        };
    },

    componentDidMount: function(){
        var self = this;

        //TODO: uncomment and change all game references to this.state.game if you want to update it dynamically

        this.onUpdateHandler = dojo.subscribe("ui/update", function(game){
            self.setState({game: game});
        });
    },

    getQueueTypeSelect: function(){
        var options = [];
        var self = this;

        for (var i in game.time.queue.queueSources){
            var source = game.time.queue.queueSources[i];
            options.push($r("option", { value: source}, source));
        }
        return $r("select", {
            value: this.state.queueTypeId,
            onChange: function(e){
                var typeId = e.target.value;

                self.setState({
                    typeId: typeId
                });
                var options = game.time.queue.getQueueOptions(typeId);
                if (options.length){
                    self.setState({
                        itemId: options[0].name,
                        itemLabel: options[0].label
                    });
                }
                
            }
        }, options);
    },

    getQueueItemSelect: function(options){
        var self = this;
        var selectOpts = [];

        for (var i in options){
            var option = options[i];
            selectOpts.push($r("option", { value: option.name, "data-label": option.label}, option.label));
        }

        if (!options.length){
            selectOpts.push($r("option", {}, "-"));
        }

        return $r("select", {
            value: this.state.itemId,
            onChange: function(e){
                self.setState({
                    itemId: e.target.value,
                    itemLabel: e.target.dataset.label
                });
            }
        }, selectOpts);
    },

    getQueueItems: function(){
        var self = this;
        var items = [];

        var queueItems = self.state.game.time.queue.queueItems;
        for (var i in queueItems){
            var item = queueItems[i];
            items.push($r("div", {}, [
                "[" + item.type + "][" + item.name + "] - " + item.label,
                $r("a", {
                    href: "#", 
                    onClick: function(e){
                        e.preventDefault();
                        
                        //TODO: implement me!
                        game.time.queue.remove(item.type, item.id);
                        self.forceUpdate();
                }}, "[x]")
            ]
            ));
        }
        return $r("div", {}, 
            items
        );
    },

    render: function(){
        var self = this;

        var typeId = this.state.typeId;
        var options = game.time.queue.getQueueOptions(typeId);

        return $r("div", {
        }, [
            this.getQueueTypeSelect(),
            this.getQueueItemSelect(options),
            $r("button", {
                onClick: function(){

                    game.time.queue.addToQueue(
                        self.state.itemId,
                        self.state.typeId,
                        self.state.itemLabel
                    );

                    //re-render component
                    self.forceUpdate();
                }
            }, "Add to queue"),

            this.getQueueItems()
        ]);
    }
});