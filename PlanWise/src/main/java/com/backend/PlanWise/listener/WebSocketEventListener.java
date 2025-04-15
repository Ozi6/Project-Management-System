package com.backend.PlanWise.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener
{

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event)
    {

    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event)
    {
        String username = event.getUser() != null ? event.getUser().getName() : null;
        if(username != null)
        {

        }
    }
}
