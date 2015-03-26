/**
 * Created by social on 3/26/2015.
 */


frontendApp.controller('flowctrl', function ($scope, $rootScope, blockUI,$routeParams,Orders ) {

    console.log('flowctrl');

    $scope.refresh=function()
    {

        console.log('refresh');
        console.log($routeParams );
        Orders.getOrder($routeParams.id,function (data) {
            blockUI.start();
            $scope.order = data;
            console.log( $scope.order.shipping.tracking.status);
            console.log(_.findWhere(window.states,{label: $scope.order.shipping.tracking.status}));
            var state=
            parseInt(_.findWhere(window.states,{label: $scope.order.shipping.tracking.status}).id);

            for(var i=0;i<=state;i++)
            {

                $scope.lightup(i,state);
            }
            blockUI.stop();
        });





    }


    $(document).ready(function () {




        var radius = 50;
        window.states = [
            {x: 100, y: 220, id: '0', label: "Order Placed", transitions: []},
            {x: 200, y: 100, id: '1', label: "DO Generated", transitions: []},
            {x: 250, y: 250, id: '2', label: "Goods Intransit", transitions: []},
            {x: 400, y: 350, id: '3', label: "PickUp Scanned", transitions: []},
            {x: 450, y: 200, id: '4', label: "Payment Init", transitions: []},
            {x: 550, y: 100, id: '5', label: "Payment Done", transitions: []},
            {x: 650, y: 200, id: '6', label: "POD", transitions: []},
            {x: 750, y: 300, id: '7', label: "END", transitions: []},


        ];


        window.states[0].transitions.push({label: 'whooo', target: window.states[1]})
        window.states[1].transitions.push({label: 'whooo', target: window.states[2]})
        window.states[2].transitions.push({label: 'whooo', target: window.states[3]})
        window.states[3].transitions.push({label: 'whooo', target: window.states[4]})
        window.states[4].transitions.push({label: 'whooo', target: window.states[5]})
        window.states[5].transitions.push({label: 'whooo', target: window.states[6]})
        window.states[6].transitions.push({label: 'whooo', target: window.states[7]})


        window.svg = d3.select('#chart')
            .append("svg")
            .attr("width", "960px")
            .attr("height", "500px");


        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 3)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000')
        ;

        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 4)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M10,-5L0,0L10,5')
            .attr('fill', '#000')
        ;

        // line displayed when dragging new nodes
        var drag_line = svg.append('svg:path')
                .attr('class', 'dragline hidden')
                .attr('d', 'M0,0L0,0')
            ;


        var gStates = svg
            .selectAll("g.state")
            .data(states);

        var transitions = function () {
            return states.reduce(function (initial, state) {
                return initial.concat(
                    state.transitions.map(function (transition) {
                        return {source: state, target: transition.target};
                    })
                );
            }, []);
        };
        // http://www.dashingd3js.com/svg-paths-and-d3js
        var computeTransitionPath = /*d3.svg.diagonal.radial()*/function (d) {
            var deltaX = d.target.x - d.source.x,
                deltaY = d.target.y - d.source.y,
                dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                normX = deltaX / dist,
                normY = deltaY / dist,
                sourcePadding = radius + 2;//d.left ? 17 : 12,
            targetPadding = radius + 6;//d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
                sourceY = d.source.y + (sourcePadding * normY),
                targetX = d.target.x - (targetPadding * normX),
                targetY = d.target.y - (targetPadding * normY);
            return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
        };
        var gTransitions = svg.append('g')
                .selectAll("path.transition")
                .data(transitions)
            ;

        var startState, endState;
        var drag = d3.behavior.drag()
            .on("drag", function (d, i) {
                if (startState) {
                    return;
                }

                var selection = d3.selectAll('.selected');

                if (selection[0].indexOf(this) == -1) {
                    selection.classed("selected", false);
                    selection = d3.select(this);
                    selection.classed("selected", true);
                }

                selection.attr("transform", function (d, i) {
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    return "translate(" + [d.x, d.y] + ")"
                })
                // reappend dragged element as last
                // so that its stays on top
                this.parentNode.appendChild(this);

                gTransitions.attr('d', computeTransitionPath);
                d3.event.sourceEvent.stopPropagation();
            })
            .on("dragend", function (d) {
                // TODO : http://stackoverflow.com/questions/14667401/click-event-not-firing-after-drag-sometimes-in-d3-js

                // needed by FF
                drag_line
                    .classed('hidden', true)
                    .style('marker-end', '')
                ;

                if (startState && endState) {
                    startState.transitions.push({label: "transition label 1", target: endState});
                    restart();
                }

                startState = undefined;
                d3.event.sourceEvent.stopPropagation();
            });

        svg
            .on("mousedown", function () {
                if (!d3.event.ctrlKey) {
                    d3.selectAll('g.selected').classed("selected", false);
                }

                var p = d3.mouse(this);

                svg.append("rect")
                    .attr({
                        rx: 6,
                        ry: 6,
                        class: "selection",
                        x: p[0],
                        y: p[1],
                        width: 0,
                        height: 0
                    })
            })
            .on("mousemove", function () {
                var p = d3.mouse(this),
                    s = svg.select("rect.selection");

                if (!s.empty()) {
                    var d = {
                            x: parseInt(s.attr("x"), 10),
                            y: parseInt(s.attr("y"), 10),
                            width: parseInt(s.attr("width"), 10),
                            height: parseInt(s.attr("height"), 10)
                        },
                        move = {
                            x: p[0] - d.x,
                            y: p[1] - d.y
                        }
                        ;

                    if (move.x < 1 || (move.x * 2 < d.width)) {
                        d.x = p[0];
                        d.width -= move.x;
                    } else {
                        d.width = move.x;
                    }

                    if (move.y < 1 || (move.y * 2 < d.height)) {
                        d.y = p[1];
                        d.height -= move.y;
                    } else {
                        d.height = move.y;
                    }

                    s.attr(d);

                    // deselect all temporary selected state objects
                    d3.selectAll('g.state.selection.selected').classed("selected", false);

                    d3.selectAll('g.state >circle.inner').each(function (state_data, i) {
                        if (
                            !d3.select(this).classed("selected") &&
                                // inner circle inside selection frame
                            state_data.x - radius >= d.x && state_data.x + radius <= d.x + d.width &&
                            state_data.y - radius >= d.y && state_data.y + radius <= d.y + d.height
                        ) {

                            d3.select(this.parentNode)
                                .classed("selection", true)
                                .classed("selected", true);
                        }
                    });
                } else if (startState) {
                    // update drag line
                    drag_line.attr('d', 'M' + startState.x + ',' + startState.y + 'L' + p[0] + ',' + p[1]);

                    var state = d3.select('g.state.hover');
                    endState = (!state.empty() && state.data()[0]) || undefined;
                }
            })
            .on("mouseup", function () {
                // remove selection frame
                svg.selectAll("rect.selection").remove();

                // remove temporary selection marker class
                d3.selectAll('g.state.selection').classed("selection", false);
            })
            .on("mouseout", function () {
                if (d3.event.relatedTarget.tagName == 'HTML') {
                    // remove selection frame
                    svg.selectAll("rect.selection").remove();

                    // remove temporary selection marker class
                    d3.selectAll('g.state.selection').classed("selection", false);
                }
            })
            .on("dblclick", function () {
                var p = d3.mouse(this)
                states.push({x: p[0], y: p[1], label: "tst", transitions: []});
                console.log('new state ', states[states.length - 1]);
                restart();
            });

        restart();

        function restart() {
            gStates = gStates.data(states);

            var gState = gStates.enter()
                .append("g")
                .attr({
                    "transform": function (d) {
                        return "translate(" + [d.x, d.y] + ")";
                    },
                    'class': 'state'
                })
                .call(drag);

            gState.append("circle")
                .attr({
                    r: radius + 4,
                    class: 'outer'
                })
                .on("mousedown", function (d) {
                    startState = d, endState = undefined;

                    // reposition drag line
                    drag_line
                        .style('marker-end', 'url(#end-arrow)')
                        .classed('hidden', false)
                        .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y)
                    ;

                    // force element to be an top
                    this.parentNode.parentNode.appendChild(this.parentNode);
                    console.log("mousedown", startState);
                });
            ;

            gState.append("circle")
                .attr({
                    r: radius,
                    class: 'inner'
                })
                .on("click", function (d, i) {
                    var e = d3.event,
                        g = this.parentNode,
                        isSelected = d3.select(g).classed("selected");

                    if (!e.ctrlKey) {
                        d3.selectAll('g.selected').classed("selected", false);
                    }

                    d3.select(g).classed("selected", !isSelected);

                    // reappend dragged element as last
                    // so that its stays on top
                    g.parentNode.appendChild(g);
                })
                .on("mouseover", function () {
                    d3.select(this.parentNode).classed("hover", true);
                })
                .on("mouseout", function () {
                    d3.select(this.parentNode).classed("hover", false);
                });
            ;

            gState.append("text")
                .attr({
                    'text-anchor': 'middle',
                    y: 4
                })
                .text(function (d) {
                    return d.label;
                })
            ;

            gState.append("title")
                .text(function (d) {
                    return d.label;
                })
            ;
            gStates.exit().remove();

            gTransitions = gTransitions.data(transitions);
            gTransitions.enter().append('path')
                .attr('class', 'transition')
                .attr('d', computeTransitionPath)
            ;
            gTransitions.exit().remove();
        };

        $scope.refresh();
    })


    $scope.color = function () {


        var svg = d3.select("#chart svg");

        $scope.lightup('1');



    }

    $scope.lightup=function(id,state)
    {
        var item=svg.selectAll("circle").filter(function (d) {
        return d.id == id;
    });

        item.
            style("fill", function (d) {
                return '#1BFA02'; //returns hex value
            });

        if(id==state)
        item.attr("class", "animated  flash shakeallday ");


    }

});