note
	description: "[
		Eiffel Microservice version of Node.js service.js
		a ØMQ socket on port 4000, reads requests on it, and replies the request.
	]"

class
	SERVICE

create
	make

feature {NONE} -- Initialization

	make
			-- Service
		local
			l_context: ZMQ_CONTEXT
			l_socket: ZMQ_SOCKET
			l_env: EXECUTION_ENVIRONMENT
			l_message: ZMQ_MESSAGE
			l_cstring: C_STRING
		do
			create l_env
			io.put_string ("Eiffel Microservice running on port:4000")

				-- Initialie 0MQ context
			create l_context.make
			l_socket := l_context.new_rep_socket
			l_socket.bind ("tcp://*:4000")
			from
			until
				False
			loop
					--  Wait for next request from client
				create l_message.default_create
				l_socket.receive_message (l_message)
				io.put_string ("Processing: ")
				io.put_new_line

				create l_cstring.make_by_pointer (l_message.data)

				io.put_string (l_cstring.string)
					-- Do some work

				l_env.sleep (1)

					-- Send replay back to client
				l_socket.put_string ("Processing ..." + l_cstring.string)
				l_message.close
			end
		end

end
