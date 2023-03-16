package name.awesomesauce.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import name.awesomesauce.models.Document
import java.io.File

fun Route.documentRouting() {
    route("/document") {
        get("{id}") {
            val id = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )

            // TODO: check for file existence and return an error in this case
            val contents = File("$id.json").readText()
            call.respondText(
                contents,
                contentType = ContentType.Application.Json,
                status = HttpStatusCode.OK
            )
        }

        post {
            val request = call.receive<Document>();
            val contents = Json.encodeToString(request.content)
            File("${request.name}.json").writeText(contents)
        }
    }
}