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
				l_socket.read_string
				io.put_string ("Processing: ")
				io.put_string (l_socket.last_string)
				io.put_new_line

					-- Do some work
				l_env.sleep (1)

					-- Send replay back to client
				l_socket.put_string ("Processing ..." + l_socket.last_string)
			end
		end

end
