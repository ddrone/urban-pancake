#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{SystemTray, SystemTrayMenu, CustomMenuItem, SystemTrayEvent, Manager};

fn main() {
  let tray_menu = SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("show".to_string(), "Show"))
    .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));
  let tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .system_tray(tray)
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::MenuItemClick { id, .. } => {
        match id.as_str() {
          "quit" => {
            std::process::exit(0);
          }
          "show" => {
            match app.get_window("main") {
              Some(w) => w.show().unwrap(),
              None => app.restart()
            }
          }
          _ => {}
        }
      }
      _ => {}
    })
    .build(tauri::generate_context!())
    .expect("error while running tauri application")
    .run(|_app_handle, event| match event {
      tauri::RunEvent::ExitRequested { api, .. } => {
        api.prevent_exit();
      }
      _ => {}
    })
}
