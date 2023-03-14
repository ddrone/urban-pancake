package name.awesomesauce

import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.testing.*
import kotlin.test.*
import io.ktor.http.*
import kotlinx.serialization.json.JsonPrimitive
import name.awesomesauce.models.Document
import name.awesomesauce.plugins.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureRouting()
            configureSerialization()
        }

        // TODO: figure out what's wrong with the tests and make them work
        client.post("/document") {
            contentType(ContentType.Application.Json)
            setBody(Document(
                "test",
                JsonPrimitive("contents")
            ))
        }.apply {
            assertEquals(HttpStatusCode.OK, status)
        }

        client.get("/document/test").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertEquals("\"contents\"", bodyAsText())
        }
    }
}
