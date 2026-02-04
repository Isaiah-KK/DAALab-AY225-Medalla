package src;

public class Record {
    private int id;
    private String firstName;
    private String lastName;

    public Record(int id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public int getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }

    @Override
    public String toString() {
        return String.format("ID: %-8d | Name: %s %s", id, firstName, lastName);
    }
} 
