import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function EventPage() {
  const dummyEvents = [
    {
      id: 1,
      nama: "Festival Tari",
      tanggal: "Sabtu, 12 Juli 2025",
      image: "/img/event1.jpg",
    },
    {
      id: 2,
      nama: "Festival Tari",
      tanggal: "Sabtu, 12 Juli 2025",
      image: "/img/event2.jpg",
    },
    {
      id: 3,
      nama: "Bazaar Karya",
      tanggal: "Sabtu, 12 Juli 2025",
      image: "/img/event3.jpg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">List Event</h1>
      <div className="space-y-4">
        {dummyEvents.map((event) => (
          <Link
            to={`/event/${event.id}`}
            key={event.id}
            className="bg-white rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={event.image}
              alt={event.nama}
              className="w-full h-48 object-cover"
            />
            <div className="flex justify-between items-center px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">{event.nama}</h2>
                <p className="text-sm text-gray-500">{event.tanggal}</p>
              </div>
              <ArrowUpRight className="text-gray-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
