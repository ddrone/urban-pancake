package name.awesomesauce.plugins

import io.ktor.server.routing.*
import io.ktor.server.application.*
import name.awesomesauce.routes.documentRouting

fun Application.configureRouting() {
    routing {
        documentRouting()
    }
}
