#include "homecontroller/api/device.h"

#include "homecontroller/api/device_data/rgb_lights.h"
#include "homecontroller/api/endpoints.h"

namespace hc {
namespace api {
template <typename StateType>
void Device<StateType>::start(const Gateway& gateway,
                              const std::string& device_id,
                              const std::string& secret,
                              const StateType& initial_state, int reconn_delay,
                              int reconn_attempts) {
    m_state = initial_state;

    register_events();

    m_client.start(gateway.m_url, gateway.m_namespace,
                   create_handshake_msg(device_id, secret), reconn_delay,
                   reconn_attempts);

    m_client.await_finish_and_cleanup();
}

template <typename StateType> void Device<StateType>::stop() {
    m_logger.verbose("Initiating client connection close...");

    m_client.shutdown();
}

template <typename StateType>
void Device<StateType>::update_state(::sio::socket::ptr socket,
                                     StateType new_state) {
    m_state = new_state;

    ::sio::message::ptr state_update_msg = ::sio::object_message::create();
    state_update_msg->get_map()["data"] = serialize_state();

    m_logger.verbose("update_state(): Sending update message to server");

    socket->emit("deviceStateChanged", state_update_msg);
}

template <typename StateType> void Device<StateType>::register_events() {
    sio::Client::EventCallback cb1 = [this](::sio::socket::ptr socket,
                                            ::sio::message::ptr msg) {
        std::string socket_id = msg->get_map()["socketId"]->get_string();

        ::sio::message::ptr reply_msg = ::sio::object_message::create();
        reply_msg->get_map()["socketId"] =
            ::sio::string_message::create(socket_id);
        reply_msg->get_map()["data"] = serialize_state();

        socket->emit("deviceCheckStateReply", reply_msg);
    };

    m_client.register_event("deviceCheckStateRequest", cb1);

    sio::Client::EventCallback cb2 = [this](::sio::socket::ptr socket,
                                            ::sio::message::ptr msg) {
        std::map<std::string, ::sio::message::ptr> data =
            msg->get_map()["data"]->get_map();

        on_command_received(socket, data);
    };

    m_client.register_event("deviceCommand", cb2);
}

template <typename StateType>
::sio::message::ptr
Device<StateType>::create_handshake_msg(const std::string& device_id,
                                        const std::string& secret) {
    ::sio::message::ptr handshake_msg = ::sio::object_message::create();
    handshake_msg->get_map()["type"] = ::sio::string_message::create("device");
    handshake_msg->get_map()["deviceId"] =
        ::sio::string_message::create(device_id);
    handshake_msg->get_map()["key"] = ::sio::string_message::create(secret);

    return handshake_msg;
}

template class Device<hc::api::rgb_lights::State>;

} // namespace api
} // namespace hc