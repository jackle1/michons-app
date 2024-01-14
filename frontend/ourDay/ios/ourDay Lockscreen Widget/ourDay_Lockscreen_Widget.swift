//
//  ourDay_Lockscreen_Widget.swift
//  ourDay Lockscreen Widget
//
//  Created by Jack Le on 2024-01-11.
//

import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), targetDate: Date(), dateName: "M♥️J")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      print("hello")
      let entry = SimpleEntry(date: Date(), targetDate: Date().addingTimeInterval(789780), dateName: "M♥️J") // Example target date
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        fetchTargetDate { targetDate, dateName in
            let currentDate = Date()
            let calendar = Calendar.current

            // Create an entry for the current hour
            let entry = SimpleEntry(date: currentDate, targetDate: targetDate ?? currentDate, dateName: dateName)

            // Calculate the next update time, which is the start of the next hour
            let nextUpdateDate = calendar.date(byAdding: .hour, value: 1, to: currentDate)!
            
            let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
            completion(timeline)
        }
    }

    private func fetchTargetDate(completion: @escaping (Date?, String?) -> Void) {
        guard let url = URL(string: "http://ourday.us-east-2.elasticbeanstalk.com/dates") else {
            completion(nil, nil)
            return
        }

        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching data: \(error)")
                completion(nil, nil)
                return
            }

            guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
                print("Error with the response, unexpected status code: \(String(describing: response))")
                completion(nil, nil)
                return
            }
          
            if let data = data {
                print("Received data: \(String(describing: String(data: data, encoding: .utf8)))")
                    do {
                        let dateFormatter = DateFormatter()
                        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                        dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
                        dateFormatter.locale = Locale(identifier: "en_US_POSIX")

                        let decoder = JSONDecoder()
                        decoder.dateDecodingStrategy = .formatted(dateFormatter)
                        let dateResponse = try decoder.decode(DateResponse.self, from: data)
                        if let nearestDate = dateResponse.dates.filter({ $0.date > Date() }).min(by: { $0.date < $1.date }) {
                            completion(nearestDate.date, nearestDate.name)
                        } else {
                            completion(nil, nil)
                        }
                    } catch {
                        print("Error decoding JSON: \(error)")
                        completion(nil, nil)
                    }
                } else {
                    completion(nil, nil)
                }
            }
            task.resume()
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let targetDate: Date
    let dateName: String?
}

struct ourDay_Lockscreen_WidgetEntryView : View {
    var entry: Provider.Entry
  
    @Environment(\.widgetFamily) var widgetFamily

    var body: some View {
        ZStack {
            // Background image
            if widgetFamily == .accessoryRectangular {
                Image("lockscreenbackground")
                .opacity(0.7)
            } else {
                Image("dudububuwidget")
                .opacity(0.7)
            }

            VStack {
                if let dateName = entry.dateName {
                    Text(dateName)
                    .font(fontForWidgetFamily(widgetFamily))
                    .multilineTextAlignment(.center)
                    Text(entry.targetDate, style: .timer)
                  //Text(timeRemaining(until: entry.targetDate))
                    .font(.headline)
                    .multilineTextAlignment(.center)
                } else {
                    Text("Plan a date!!!")
                    .font(.headline)
                }
            }
            .padding(5) // Adjust padding
            .background(Color.pink.opacity(0.5)) // Adjust opacity
            .cornerRadius(8)
            .frame(width: 140)
        }
    }

    func fontForWidgetFamily(_ family: WidgetFamily) -> Font {
        switch family {
        case .accessoryRectangular:
            return .headline // Smaller font size for accessoryRectangular
        case .systemSmall:
            return .title3
        default:
            return .headline // Default font size for other families
        }
    }
  
//    func timeRemaining(until targetDate: Date) -> String {
//        let now = Date()
//        let calendar = Calendar.current
//        let components = calendar.dateComponents([.day, .hour, .minute], from: now, to: targetDate)
//        return "\(components.day ?? 0)d \(components.hour ?? 0)h \(components.minute ?? 0)m"
//    }
}

struct ourDay_Lockscreen_Widget: Widget {
    let kind: String = "ourDay_Lockscreen_Widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                ourDay_Lockscreen_WidgetEntryView(entry: entry)
                    .containerBackground(.fill.tertiary, for: .widget)
            } else {
                ourDay_Lockscreen_WidgetEntryView(entry: entry)
                    .padding()
                    .background()
            }
        }
        .configurationDisplayName("Countdown Timer Widget")
        .description("Countdown until our next date")
        .supportedFamilies([.systemSmall, .accessoryRectangular]) // Include Lock Screen widget sizes
    }
}

struct DateResponse: Codable {
    let dates: [DateEntry]
}

struct DateEntry: Codable {
    let date: Date
    let name: String
    // Include other fields as needed
}

//#Preview(as: .systemSmall) {
//    ourDay_Lockscreen_Widget()
//} timeline: {
//    SimpleEntry(date: .now, targetDate: Date().addingTimeInterval(3600))
//    SimpleEntry(date: .now, targetDate: Date().addingTimeInterval(86400))
//}
