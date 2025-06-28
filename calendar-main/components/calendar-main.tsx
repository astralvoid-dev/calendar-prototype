"use client"

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Temporal } from "@js-temporal/polyfill";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter, DialogHeader } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

export default function MainCalendar(){
    const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
    const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
    const [monthCalendar, setMonthCalendar] = useState<{ date: Temporal.PlainDate; isInMonth: boolean }[]>([]);
    const [weekCalendar, setWeekCalendar] = useState<{ date: Temporal.PlainDate }[]>([]);
    const [startOfWeek, setStartOfWeek] = useState(Temporal.Now.plainDateISO().subtract({days: Temporal.Now.plainDateISO().dayOfWeek - 1}));
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    useEffect(() => {
        const length = 7;
        
        const calendar = new Array(length)
        .fill({})
        .map((_, index) => {
            const date = startOfWeek.add({
                days: index
            });
            return { date };
        });

        setWeekCalendar(calendar);
    }, [startOfWeek])

    useEffect(() => {
        const fiveWeeks = 5 * 7;
        const sixWeeks = 6 * 7;
        const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
        const monthLength = startOfMonth.daysInMonth;
        const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek - 1;


        // Calculate the overall length including days from the previous and next months to be shown
        const length = dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

        const calendar = new Array(length)
        .fill({})
        .map((_, index) => {
            const date = startOfMonth.add({
                days: index - dayOfWeekMonthStartedOn
            });
            return {
                isInMonth: !(
                    index < dayOfWeekMonthStartedOn ||
                    index - dayOfWeekMonthStartedOn >= monthLength
                ),
                date
            }
        });

        setMonthCalendar(calendar);
    }, [year, month]);

    const moveToPreviousMonth = () => {
        const { month: previousMonth, year: previousYear } = Temporal.PlainYearMonth.from({
            month,
            year
        }).subtract({months: 1});
        setMonth(previousMonth);
        setYear(previousYear);
    };

    const moveToNextMonth = () => {
        const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
            month,
            year
        }).add({months: 1});
        setMonth(nextMonth);
        setYear(nextYear);
    };

    const moveToPreviousWeek = () => {
        const previousStartOfWeek = startOfWeek.subtract({ days: 7 });
        setStartOfWeek(previousStartOfWeek);
    };

    const moveToNextWeek = () => {
        const nextStartOfWeek = startOfWeek.add({ days: 7 });
        setStartOfWeek(nextStartOfWeek);
    };

    return(
        <div>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button>Neue Termin</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Termin erstellen</DialogTitle>
                            <DialogDescription>
                                <Label className="font-bold" htmlFor="name">Titel</Label>
                                <Input id="name" name="title" defaultValue="Neuer Termin"/>
                                <Label className="font-bold" htmlFor="start-time">Startzeit</Label>
                                <Label htmlFor="date-picker-1">Datum</Label>
                                <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                                    <PopoverTrigger asChild>
                                        <Button
                                         variant="outline"
                                        >
                                            {startDate ? startDate.toLocaleDateString() : "Datum wählen"}
                                            <ChevronDownIcon/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setStartDate(date);
                                                setOpenStartDate(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Label htmlFor="time-picker-1">Uhrzeit</Label>
                                <Input
                                    type="time"
                                    id="time-picker-1"
                                    step="1"
                                    defaultValue="10:30:00"
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <Label className="font-bold" htmlFor="end-time">Endzeit</Label>
                                <Label htmlFor="date-picker-2">Datum</Label>
                                <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                                    <PopoverTrigger asChild>
                                        <Button
                                         variant="outline"
                                        >
                                            {endDate ? endDate.toLocaleDateString() : "Datum wählen"}
                                            <ChevronDownIcon/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setEndDate(date);
                                                setOpenEndDate(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Label htmlFor="time-picker-2">Uhrzeit</Label>
                                <Input
                                    type="time"
                                    id="time-picker-2"
                                    step="1"
                                    defaultValue="10:30:00"
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <Label className="font-bold" htmlFor="location">Standort</Label>
                                <Input id="location" placeholder="Standort hinfügen"/>
                                <Label className="font-bold" htmlFor="notes">Notizen</Label>
                                <Input id="notes" placeholder="Notizen hinfügen"/>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Abbrechen</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
            <Tabs defaultValue="month">
                <TabsList>
                    <TabsTrigger value="list">Liste</TabsTrigger>
                    <TabsTrigger value="week">Woche</TabsTrigger>
                    <TabsTrigger value="month">Monat</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    List
                </TabsContent>
                <TabsContent value="week">
                    <Button onClick={moveToPreviousWeek}>
                        Previous
                    </Button>
                    <Button onClick={moveToNextWeek}>
                        Next
                    </Button>
                    <div className="grid grid-cols-8">
                        {/* Empty cell */}
                        <div />
                        {weekCalendar.map((day, index) => {
                            const dayNames = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
                            const dayName = dayNames[day.date.dayOfWeek - 1];
                            return (
                                <div className="border border-slate-700 p-2 text-center" key={index}>
                                    {dayName}, {day.date.day}.{day.date.month}.
                                </div>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-8 flex-grow">
                    <div className="flex flex-col">
                        {Array.from({ length: 24 }).map((_, hour) => (
                            <div
                                key={`hour-label-${hour}`}
                                className="border border-slate-300 min-h-[40px] flex items-center justify-center bg-slate-100 font-mono text-xs"
                            >
                                {hour}:00
                            </div>
                        ))}
                    </div>
                    <div className="col-span-7 grid grid-cols-7 flex-1">
                        {Array.from({ length: 24 }).map((_, hour) =>
                            Array.from({ length: 7 }).map((__, dayIdx) => (
                                <div
                                    key={`${hour}-${dayIdx}`}
                                    className="border border-slate-300 min-h-[40px] flex flex-col bg-white hover:bg-gray-400"
                                >
                                    {/* Cell content */}
                                </div>
                            ))
                        )}
                    </div>
                    </div>
                </TabsContent>
                <TabsContent value="month">
                    <h2 className="text-lg font-semibold">
                        {Temporal.PlainDate.from({year, month, day: 1}).toLocaleString("de", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h2>
                    <Button onClick={moveToPreviousMonth}>
                        Previous
                    </Button>
                    <Button onClick={moveToNextMonth}>
                        Next
                    </Button>
                    <div className="grid grid-cols-7">
                        {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map(
                            (name, index) => (<div key={index}>{name}</div>)
                        )}
                    </div>
                    <div className="grid grid-cols-7 flex-grow">
                        {monthCalendar.map((day, index) => (
                            <div
                            key={index}
                            className={`border border-slate-700 p-2 ${
                                day.isInMonth
                                ? "bg-white hover:bg-gray-400"
                                : "bg-slate-300 hover:bg-slate-400 font-light text-slate-600"
                            }`}
                            >
                                {day.date.day}
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}